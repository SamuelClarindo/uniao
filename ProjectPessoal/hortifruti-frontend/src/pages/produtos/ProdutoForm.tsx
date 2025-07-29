// src/pages/produtos/ProdutoForm.tsx
import { Modal, Button, Label, TextInput, Textarea, Select } from 'flowbite-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Fornecedor, Produto } from '../../types/entities';
import { useEffect } from 'react';

// Esquema de validação com Zod, espelhando o DTO do back-end
const produtoSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  codigo: z.string().min(1, 'O código é obrigatório'),
  unidade_medida: z.string().min(1, 'A unidade de medida é obrigatória'),
  fornecedorId: z.coerce.number().min(1, 'Selecione um fornecedor'),
  descricao: z.string().optional(),
});

type ProdutoFormData = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProdutoFormData) => void;
  produtoInicial?: Produto | null;
  fornecedores: Fornecedor[];
  isLoading: boolean;
}

export function ProdutoForm({ isOpen, onClose, onSave, produtoInicial, fornecedores, isLoading }: ProdutoFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
  });

  useEffect(() => {
    if (produtoInicial) {
      reset({
        ...produtoInicial,
        fornecedorId: produtoInicial.fornecedor.id,
      });
    } else {
      reset({
        nome: '',
        codigo: '',
        descricao: '',
        unidade_medida: 'UN',
        fornecedorId: 0,
      });
    }
  }, [produtoInicial, reset]);

  const onSubmit: SubmitHandler<ProdutoFormData> = (data) => {
    onSave(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>{produtoInicial ? 'Editar Produto' : 'Adicionar Novo Produto'}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome" value="Nome do Produto" />
              <TextInput id="nome" {...register('nome')} placeholder="Ex: Maçã Fuji" />
              {errors.nome && <span className="text-sm text-red-600">{errors.nome.message}</span>}
            </div>
            <div>
              <Label htmlFor="codigo" value="Código" />
              <TextInput id="codigo" {...register('codigo')} placeholder="Ex: 789123" />
              {errors.codigo && <span className="text-sm text-red-600">{errors.codigo.message}</span>}
            </div>
          </div>
           <div>
            <Label htmlFor="fornecedorId" value="Fornecedor Principal" />
            <Select id="fornecedorId" {...register('fornecedorId')}>
              <option value={0}>Selecione um fornecedor</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </Select>
             {errors.fornecedorId && <span className="text-sm text-red-600">{errors.fornecedorId.message}</span>}
          </div>
          <div>
            <Label htmlFor="unidade_medida" value="Unidade de Medida" />
            <TextInput id="unidade_medida" {...register('unidade_medida')} placeholder="Ex: UN, KG, DZ" />
            {errors.unidade_medida && <span className="text-sm text-red-600">{errors.unidade_medida.message}</span>}
          </div>
          <div>
            <Label htmlFor="descricao" value="Descrição (Opcional)" />
            <Textarea id="descricao" {...register('descricao')} rows={3} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}