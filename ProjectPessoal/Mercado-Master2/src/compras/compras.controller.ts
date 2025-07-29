import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  @Get()
  async findAll() {
    const compras = await this.comprasService.findAll();
    return { data: compras, total: compras.length };
  }

  @Get('report')
  async getReport(
    @Query('data_inicio') data_inicio: string,
    @Query('data_fim') data_fim: string,
    @Query('fornecedorId') fornecedorId?: string
  ) {
    const fornecedorIdNum = fornecedorId ? Number(fornecedorId) : undefined;
    return this.comprasService.findReport(data_inicio, data_fim, fornecedorIdNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.findOne(id);
  }
  
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCompraDto: UpdateCompraDto) {
    return this.comprasService.update(id, updateCompraDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.remove(id);
  }
}