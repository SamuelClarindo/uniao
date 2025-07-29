import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    ParseIntPipe,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Controller('despesas')
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  create(@Body() createDespesaDto: CreateDespesaDto) {
    return this.despesasService.create(createDespesaDto);
  }

  @Get()
  async findAll() {
    const despesas = await this.despesasService.findAll();
    return { data: despesas, total: despesas.length };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.despesasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDespesaDto: UpdateDespesaDto) {
    return this.despesasService.update(id, updateDespesaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.despesasService.remove(id);
  }
}