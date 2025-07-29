// src/pages/fornecedores/FornecedorForm.tsx
import { Modal, Button, Label, TextInput } from 'flowbite-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Fornecedor } from '../../types/entities';
import { useEffect } from 'react';

// Esquema de validação com Zod, espelhando o CreateFornecedorDto
const fornecedorSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório').max(255),
  cnpj: z.string().max(18, 'O CNPJ deve ter no máximo 18 caracteres').optional().or(z.literal('')),
  contato_nome: z.string().max(100).optional().or(z.literal('')),
  contato_telefone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('Digite um e-mail válido').max(255).optional().or(z.literal('')),
});

type FornecedorFormData = z.infer<typeof fornecedorSchema>;

interface FornecedorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FornecedorFormData) => void;
  fornecedorInicial?: Fornecedor | null;
  isLoading: boolean;
}

export function FornecedorForm({ isOpen, onClose, onSave, fornecedorInicial, isLoading }: FornecedorFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
  });

  useEffect(() => {
    if (isOpen) {
        if (fornecedorInicial) {
            reset(fornecedorInicial);
        } else {
            reset({ nome: '', cnpj: '', contato_nome: '', contato_telefone: '', email: '' });
        }
    }
  }, [fornecedorInicial, isOpen, reset]);

  const onSubmit: SubmitHandler<FornecedorFormData> = (data) => {
    onSave(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>{fornecedorInicial ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nome" value="Nome do Fornecedor" />
            <TextInput id="nome" {...register('nome')} placeholder="Ex: Distribuidora de Frutas" />
            {errors.nome && <span className="text-sm text-red-600">{errors.nome.message}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cnpj" value="CNPJ (Opcional)" />
              <TextInput id="cnpj" {...register('cnpj')} placeholder="00.000.000/0000-00" />
               {errors.cnpj && <span className="text-sm text-red-600">{errors.cnpj.message}</span>}
            </div>
            <div>
              <Label htmlFor="email" value="E-mail (Opcional)" />
              <TextInput id="email" type="email" {...register('email')} placeholder="contato@email.com" />
               {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contato_nome" value="Nome do Contato (Opcional)" />
              <TextInput id="contato_nome" {...register('contato_nome')} placeholder="Ex: João da Silva" />
            </div>
            <div>
              <Label htmlFor="contato_telefone" value="Telefone do Contato (Opcional)" />
              <TextInput id="contato_telefone" {...register('contato_telefone')} placeholder="(00) 99999-9999" />
            </div>
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