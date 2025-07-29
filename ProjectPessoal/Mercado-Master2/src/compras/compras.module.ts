import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { Compra } from './entities/compra.entity';
import { ItemCompra } from './entities/item-compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Compra, ItemCompra])],
  controllers: [ComprasController],
  providers: [ComprasService],
})
export class ComprasModule {}
