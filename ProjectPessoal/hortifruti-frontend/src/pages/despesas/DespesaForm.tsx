// src/pages/despesas/DespesaForm.tsx
import { Modal, Button, Label, TextInput } from 'flowbite-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Despesa } from '../../types/entities';
import { useEffect } from 'react';

// Função para formatar a data para o input type="date" (YYYY-MM-DD)
const formatDateForInput = (dateString?: string | Date) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

// Esquema de validação com Zod
const despesaSchema = z.object({
  descricao: z.string().min(1, 'A descrição é obrigatória').max(255),
  plano_contas: z.string().min(1, 'O plano de contas é obrigatório'),
  valor: z.coerce.number().positive('O valor deve ser um número positivo'),
  data_vencimento: z.string().min(1, 'A data de vencimento é obrigatória'),
  data_pagamento: z.string().optional(),
});

type DespesaFormData = z.infer<typeof despesaSchema>;

interface DespesaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DespesaFormData) => void;
  despesaInicial?: Despesa | null;
  isLoading: boolean;
}

export function DespesaForm({ isOpen, onClose, onSave, despesaInicial, isLoading }: DespesaFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
  });

  useEffect(() => {
    if (isOpen) {
        if (despesaInicial) {
            reset({
                ...despesaInicial,
                data_vencimento: formatDateForInput(despesaInicial.data_vencimento),
                data_pagamento: formatDateForInput(despesaInicial.data_pagamento),
            });
        } else {
            reset({ descricao: '', plano_contas: '', valor: 0, data_vencimento: '', data_pagamento: '' });
        }
    }
  }, [despesaInicial, isOpen, reset]);

  const onSubmit: SubmitHandler<DespesaFormData> = (data) => {
    onSave(data);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>{despesaInicial ? 'Editar Despesa' : 'Adicionar Nova Despesa'}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="descricao" value="Descrição da Despesa" />
            <TextInput id="descricao" {...register('descricao')} placeholder="Ex: Conta de Energia" />
            {errors.descricao && <span className="text-sm text-red-600">{errors.descricao.message}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plano_contas" value="Plano de Contas" />
              <TextInput id="plano_contas" {...register('plano_contas')} placeholder="Ex: Contas de Consumo" />
               {errors.plano_contas && <span className="text-sm text-red-600">{errors.plano_contas.message}</span>}
            </div>
            <div>
              <Label htmlFor="valor" value="Valor" />
              <TextInput id="valor" type="number" step="0.01" {...register('valor')} placeholder="0,00" />
               {errors.valor && <span className="text-sm text-red-600">{errors.valor.message}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_vencimento" value="Data de Vencimento" />
              <TextInput id="data_vencimento" type="date" {...register('data_vencimento')} />
               {errors.data_vencimento && <span className="text-sm text-red-600">{errors.data_vencimento.message}</span>}
            </div>
            <div>
              <Label htmlFor="data_pagamento" value="Data de Pagamento (Opcional)" />
              <TextInput id="data_pagamento" type="date" {...register('data_pagamento')} />
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