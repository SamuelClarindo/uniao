import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from '../vendas/entities/venda.entity';
import { Despesa } from '../despesas/entities/despesa.entity';
import { Compra } from '../compras/entities/compra.entity';
import { HistoricoImportacao } from '../importacao/entities/historico-importacao.entity';
import { DashboardKpisQueryDto, DashboardPeriodQueryDto, DashboardTopProductsQueryDto } from './dashboard.controller';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Venda)
    private readonly vendaRepository: Repository<Venda>,
    @InjectRepository(Despesa)
    private readonly despesaRepository: Repository<Despesa>,
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(HistoricoImportacao)
    private readonly historicoRepository: Repository<HistoricoImportacao>,
  ) {}

  async calculateKPIs(query: DashboardKpisQueryDto) {
    const { periodo = 'ano', data_inicio, data_fim } = query;
    
    // Definir período padrão se não fornecido
    const { startDate, endDate } = this.getDateRange(periodo, data_inicio, data_fim);

    // Calcular Lucro Bruto (dados automáticos - vendas)
    const lucroBrutoResult = await this.vendaRepository
      .createQueryBuilder('v')
      .leftJoin('v.historico_importacao', 'hi')
      .select('SUM(v.preco_venda_total - v.custo_total)', 'lucroBruto')
      .where('hi.data_importacao BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    // Calcular Despesas (dados manuais)
    const despesasResult = await this.despesaRepository
      .createQueryBuilder('d')
      .select('SUM(d.valor)', 'despesas')
      .where('d.data_vencimento BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    // Calcular Compras (dados manuais)
    const comprasResult = await this.compraRepository
      .createQueryBuilder('c')
      .select('COUNT(*)', 'compras')
      .where('c.data_compra BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    const lucroBruto = parseFloat(lucroBrutoResult?.lucroBruto || '0');
    const despesas = parseFloat(despesasResult?.despesas || '0');
    const compras = parseInt(comprasResult?.compras || '0');
    const lucroLiquido = lucroBruto - despesas;

    return {
      lucroBruto: Math.round(lucroBruto * 100) / 100,
      despesas: Math.round(despesas * 100) / 100,
      compras,
      lucroLiquido: Math.round(lucroLiquido * 100) / 100,
    };
  }

  async getRevenueData(query: DashboardPeriodQueryDto) {
    const { periodo = 'ano', data_inicio, data_fim } = query;
    const { startDate, endDate } = this.getDateRange(periodo, data_inicio, data_fim);

    const dateFormat = this.getDateFormat(periodo);
    const groupBy = this.getGroupBy(periodo);

    const result = await this.vendaRepository
      .createQueryBuilder('v')
      .leftJoin('v.historico_importacao', 'hi')
      .select([
        `${groupBy} as periodo`,
        'SUM(v.preco_venda_total - v.custo_total) as lucroBruto',
        'SUM(v.preco_venda_total) as venda'
      ])
      .where('hi.data_importacao BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('periodo')
      .orderBy('periodo', 'ASC')
      .getRawMany();

    return result.map(item => ({
      periodo: this.formatPeriod(periodo, item.periodo),
      lucroBruto: parseFloat(item.lucroBruto || '0'),
      venda: parseFloat(item.venda || '0'),
    }));
  }

  async getTopProducts(query: DashboardTopProductsQueryDto) {
    const { tipo = 'valor', periodo = 'ano', data_inicio, data_fim, limit = 6 } = query;
    const { startDate, endDate } = this.getDateRange(periodo, data_inicio, data_fim);

    const valueField = tipo === 'valor' ? 'v.preco_venda_total' : 'v.quantidade_vendida';

    const result = await this.vendaRepository
      .createQueryBuilder('v')
      .leftJoin('v.produto', 'p')
      .leftJoin('v.historico_importacao', 'hi')
      .select([
        'p.nome as name',
        `SUM(${valueField}) as value`
      ])
      .where('hi.data_importacao BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('p.id, p.nome')
      .orderBy('value', 'DESC')
      .limit(limit)
      .getRawMany();

    // Calcular percentuais
    const total = result.reduce((sum, item) => sum + parseFloat(item.value || '0'), 0);
    
    return result.map(item => ({
      name: item.name,
      value: parseFloat(item.value || '0'),
      percentage: total > 0 ? Math.round((parseFloat(item.value || '0') / total) * 100) : 0,
    }));
  }

  async getExpensesData(query: DashboardPeriodQueryDto) {
    const { periodo = 'ano', data_inicio, data_fim } = query;
    const { startDate, endDate } = this.getDateRange(periodo, data_inicio, data_fim);

    const result = await this.despesaRepository
      .createQueryBuilder('d')
      .select([
        'd.plano_contas as name',
        'SUM(d.valor) as value'
      ])
      .where('d.data_vencimento BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('d.plano_contas')
      .orderBy('value', 'DESC')
      .getRawMany();

    const colors = ['#2b3034', '#92bfff', '#94e9b8', '#d5d5d5', '#ffb366', '#ff9999'];

    return result.map((item, index) => ({
      name: item.name,
      value: parseFloat(item.value || '0'),
      color: colors[index % colors.length],
    }));
  }

  async getSalesData(query: DashboardPeriodQueryDto) {
    const { periodo = 'ano', data_inicio, data_fim } = query;
    const { startDate, endDate } = this.getDateRange(periodo, data_inicio, data_fim);

    const groupBy = this.getGroupBy(periodo);

    const result = await this.vendaRepository
      .createQueryBuilder('v')
      .leftJoin('v.historico_importacao', 'hi')
      .select([
        `${groupBy} as periodo`,
        'SUM(v.preco_venda_total) as value'
      ])
      .where('hi.data_importacao BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('periodo')
      .orderBy('periodo', 'ASC')
      .getRawMany();

    return result.map(item => ({
      periodo: this.formatPeriod(periodo, item.periodo),
      value: parseFloat(item.value || '0'),
    }));
  }

  private getDateRange(periodo: string, data_inicio?: string, data_fim?: string) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (data_inicio && data_fim) {
      startDate = new Date(data_inicio);
      endDate = new Date(data_fim);
    } else {
      switch (periodo) {
        case 'ano':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
        case 'mes':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'semana':
          const dayOfWeek = now.getDay();
          const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          startDate = new Date(now.setDate(diff));
          endDate = new Date(now.setDate(diff + 6));
          break;
        default:
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
      }
    }

    return { startDate, endDate };
  }

  private getDateFormat(periodo: string): string {
    switch (periodo) {
      case 'ano':
        return 'MMM';
      case 'mes':
        return "'Semana ' || EXTRACT(WEEK FROM hi.data_importacao)";
      case 'semana':
        return 'DD/MM';
      default:
        return 'MMM';
    }
  }

  private getGroupBy(periodo: string): string {
    switch (periodo) {
      case 'ano':
        return "TO_CHAR(hi.data_importacao, 'Mon')";
      case 'mes':
        return "'Semana ' || EXTRACT(WEEK FROM hi.data_importacao)";
      case 'semana':
        return "TO_CHAR(hi.data_importacao, 'DD/MM')";
      default:
        return "TO_CHAR(hi.data_importacao, 'Mon')";
    }
  }

  private formatPeriod(periodo: string, rawPeriod: string): string {
    if (periodo === 'mes' && rawPeriod.startsWith('Semana ')) {
      return rawPeriod;
    }
    
    if (periodo === 'ano') {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthIndex = months.findIndex(m => m.toLowerCase() === rawPeriod.toLowerCase());
      return monthIndex >= 0 ? months[monthIndex] : rawPeriod;
    }

    return rawPeriod;
  }
} 