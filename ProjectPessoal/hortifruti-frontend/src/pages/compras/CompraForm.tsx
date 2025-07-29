// src/pages/compras/CompraForm.tsx
import { Modal, Button, Label, TextInput, Select, Table } from 'flowbite-react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Fornecedor, Produto, CreateCompraDto } from '../../types/entities';
import { useEffect, useState } from 'react';
import { HiTrash } from 'react-icons/hi';

// Esquema de validação para um item individual
const itemCompraSchema = z.object({
  produtoId: z.coerce.number().min(1, "Selecione um produto"),
  quantidade: z.coerce.number().positive("Deve ser > 0"),
  preco_custo_unitario: z.coerce.number().positive("Deve ser > 0"),
});

// Esquema de validação para a compra completa
const compraSchema = z.object({
  fornecedorId: z.coerce.number().min(1, "Selecione um fornecedor"),
  data_compra: z.string().optional(),
  nota_fiscal: z.string().optional(),
  itens: z.array(itemCompraSchema).min(1, "Adicione pelo menos um item à compra"),
});

type CompraFormData = z.infer<typeof compraSchema>;

interface CompraFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompraFormData) => void;
  fornecedores: Fornecedor[];
  produtos: Produto[];
  isLoading: boolean;
}

export function CompraForm({ isOpen, onClose, onSave, fornecedores, produtos, isLoading }: CompraFormProps) {
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<CompraFormData>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      itens: [],
      data_compra: new Date().toISOString().split('T')[0]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens"
  });

  const watchItens = watch("itens");
  const valorTotal = watchItens.reduce((total, item) => {
    const preco = item.preco_custo_unitario || 0;
    const qtd = item.quantidade || 0;
    return total + (preco * qtd);
  }, 0);


  useEffect(() => {
    if (!isOpen) {
      reset({ itens: [], fornecedorId: 0, nota_fiscal: '', data_compra: new Date().toISOString().split('T')[0] });
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<CompraFormData> = (data) => {
    onSave(data);
  };

  return (
    <Modal show={isOpen} size="4xl" onClose={onClose}>
      <Modal.Header>Lançar Nova Compra</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mestre da Compra */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fornecedorId" value="Fornecedor" />
              <Select id="fornecedorId" {...register('fornecedorId')}>
                <option value={0}>Selecione...</option>
                {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </Select>
              {errors.fornecedorId && <span className="text-sm text-red-600">{errors.fornecedorId.message}</span>}
            </div>
            <div>
              <Label htmlFor="data_compra" value="Data da Compra" />
              <TextInput id="data_compra" type="date" {...register('data_compra')} />
            </div>
            <div>
              <Label htmlFor="nota_fiscal" value="Nota Fiscal (Opcional)" />
              <TextInput id="nota_fiscal" {...register('nota_fiscal')} />
            </div>
          </div>

          {/* Detalhes dos Itens */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-t pt-4">Itens da Compra</h3>
            {errors.itens?.message && <span className="text-sm text-red-600">{errors.itens.message}</span>}
            <Table>
              <Table.Head>
                <Table.HeadCell>Produto</Table.HeadCell>
                <Table.HeadCell>Quantidade</Table.HeadCell>
                <Table.HeadCell>Custo Unit.</Table.HeadCell>
                <Table.HeadCell>Subtotal</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {fields.map((field, index) => {
                  const item = watchItens[index];
                  const subtotal = (item?.quantidade || 0) * (item?.preco_custo_unitario || 0);
                  return (
                    <Table.Row key={field.id}>
                      <Table.Cell>
                        <Select {...register(`itens.${index}.produtoId`)}>
                          <option>Selecione</option>
                          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </Select>
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput type="number" step="0.001" {...register(`itens.${index}.quantidade`)} />
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput type="number" step="0.01" {...register(`itens.${index}.preco_custo_unitario`)} />
                      </Table.Cell>
                      <Table.Cell>{`R$ ${subtotal.toFixed(2)}`}</Table.Cell>
                      <Table.Cell>
                        <Button size="xs" color="red" onClick={() => remove(index)}><HiTrash /></Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            <Button
              type="button"
              color="gray"
              onClick={() => append({ produtoId: 0, quantidade: 1, preco_custo_unitario: 0 })}
            >
              Adicionar Item
            </Button>
          </div>

          <div className="text-right text-xl font-bold border-t pt-4">
            Total da Compra: R$ {valorTotal.toFixed(2)}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Compra'}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}