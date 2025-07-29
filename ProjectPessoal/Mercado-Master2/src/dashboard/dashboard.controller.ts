import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

export class DashboardKpisQueryDto {
  periodo?: 'ano' | 'mes' | 'semana';
  data_inicio?: string;
  data_fim?: string;
}

export class DashboardPeriodQueryDto {
  periodo?: 'ano' | 'mes' | 'semana';
  data_inicio?: string;
  data_fim?: string;
}

export class DashboardTopProductsQueryDto {
  tipo?: 'valor' | 'quantidade';
  periodo?: 'ano' | 'mes' | 'semana';
  data_inicio?: string;
  data_fim?: string;
  limit?: number;
}

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  async getKPIs(@Query() query: DashboardKpisQueryDto) {
    return this.dashboardService.calculateKPIs(query);
  }

  @Get('revenue')
  async getRevenue(@Query() query: DashboardPeriodQueryDto) {
    return this.dashboardService.getRevenueData(query);
  }

  @Get('top-products')
  async getTopProducts(@Query() query: DashboardTopProductsQueryDto) {
    return this.dashboardService.getTopProducts(query);
  }

  @Get('expenses')
  async getExpenses(@Query() query: DashboardPeriodQueryDto) {
    return this.dashboardService.getExpensesData(query);
  }

  @Get('sales')
  async getSales(@Query() query: DashboardPeriodQueryDto) {
    return this.dashboardService.getSalesData(query);
  }
} 