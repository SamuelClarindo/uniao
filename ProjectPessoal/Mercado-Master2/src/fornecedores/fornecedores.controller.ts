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
import { FornecedoresService } from './fornecedores.service';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';

@Controller('fornecedores') // Define a rota base para este controller: /fornecedores
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @Post() // Rota: POST /fornecedores
  create(@Body() createFornecedorDto: CreateFornecedorDto) {
    return this.fornecedoresService.create(createFornecedorDto);
  }

  @Get() // Rota: GET /fornecedores
  async findAll() {
    const fornecedores = await this.fornecedoresService.findAll();
    return { data: fornecedores, total: fornecedores.length };
  }

  @Get('all')
  findAllFornecedoresSimples() {
    return this.fornecedoresService.findAll();
  }

  @Get(':id') // Rota: GET /fornecedores/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe valida e transforma o parâmetro 'id' em um número
    return this.fornecedoresService.findOne(id);
  }

  @Patch(':id') // Rota: PATCH /fornecedores/:id
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFornecedorDto: UpdateFornecedorDto) {
    return this.fornecedoresService.update(id, updateFornecedorDto);
  }

  @Delete(':id') // Rota: DELETE /fornecedores/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna o status 204 No Content em caso de sucesso
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fornecedoresService.remove(id);
  }
}
