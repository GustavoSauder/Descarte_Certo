import React, { useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Usando um input type=date para simplicidade e responsividade
const ColetaAgendadaPage = () => {
  const [date, setDate] = useState('');
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [success, setSuccess] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editFields, setEditFields] = useState({ date: '', endereco: '', complemento: '', observacoes: '' });
  const [agendamentos, setAgendamentos] = useState(() => {
    // Carrega agendamentos do localStorage
    const saved = localStorage.getItem('coletasAgendadas');
    return saved ? JSON.parse(saved) : [];
  });

  const resetForm = () => {
    setDate('');
    setEndereco('');
    setComplemento('');
    setObservacoes('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && endereco) {
      const novoAgendamento = {
        date,
        endereco,
        complemento,
        observacoes,
        createdAt: new Date().toISOString(),
      };
      const novos = [...agendamentos, novoAgendamento];
      setAgendamentos(novos);
      localStorage.setItem('coletasAgendadas', JSON.stringify(novos));
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 2500);
    }
  };

  const handleDelete = (idx) => {
    const novos = agendamentos.filter((_, i) => i !== idx);
    setAgendamentos(novos);
    localStorage.setItem('coletasAgendadas', JSON.stringify(novos));
    if (editIdx === idx) setEditIdx(null);
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditFields({
      date: agendamentos[idx].date,
      endereco: agendamentos[idx].endereco,
      complemento: agendamentos[idx].complemento || '',
      observacoes: agendamentos[idx].observacoes || '',
    });
  };

  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleEditSave = (idx) => {
    const novos = agendamentos.map((a, i) =>
      i === idx ? { ...a, ...editFields } : a
    );
    setAgendamentos(novos);
    localStorage.setItem('coletasAgendadas', JSON.stringify(novos));
    setEditIdx(null);
  };

  const handleEditCancel = () => {
    setEditIdx(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-1 py-4 sm:py-8 overflow-x-hidden">
      <Card className="w-full max-w-lg p-4 sm:p-8 flex flex-col items-center shadow-2xl border-2 border-green-200 dark:border-green-900 bg-white/90 dark:bg-gray-900/80 mt-2 mb-8 rounded-2xl">
        <div className="flex flex-col items-center w-full mb-6">
          <FaCalendarAlt className="text-4xl text-green-600 mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center leading-tight">Agendar Coleta</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-base sm:text-lg">
            Preencha os campos abaixo para agendar a coleta em sua residência ou empresa.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 items-center mb-4">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base shadow-sm"
            min={new Date().toISOString().split('T')[0]}
            required
          />
          <input
            type="text"
            placeholder="Endereço completo"
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base shadow-sm"
            required
          />
          <input
            type="text"
            placeholder="Complemento (opcional)"
            value={complemento}
            onChange={e => setComplemento(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base shadow-sm"
          />
          <textarea
            placeholder="Observações (opcional)"
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base shadow-sm resize-none"
            rows={2}
          />
          <Button type="submit" variant="primary" size="lg" className="w-full mt-1 text-lg py-3 rounded-xl">
            Agendar Coleta
          </Button>
        </form>
        {success && (
          <div className="flex items-center gap-2 mt-2 mb-4 text-green-700 bg-green-100 dark:bg-green-900/60 px-4 py-3 rounded-lg shadow-sm animate-bounce-in w-full justify-center">
            <FaCheckCircle className="text-green-500 text-xl" />
            <span className="font-semibold text-base">Coleta agendada com sucesso!</span>
          </div>
        )}
        <div className="w-full mt-6">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-green-500" /> Minhas Coletas Agendadas
          </h2>
          {agendamentos.length === 0 ? (
            <div className="text-gray-400 text-center text-base py-6">Nenhuma coleta agendada ainda.</div>
          ) : (
            <ul className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              {agendamentos.map((a, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-green-50 dark:bg-green-900/40 rounded-xl px-4 py-3 shadow-sm border border-green-100 dark:border-green-800 gap-2">
                  {editIdx === i ? (
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="date"
                        name="date"
                        value={editFields.date}
                        onChange={handleEditChange}
                        className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm mb-1"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <input
                        type="text"
                        name="endereco"
                        placeholder="Endereço completo"
                        value={editFields.endereco}
                        onChange={handleEditChange}
                        className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm mb-1"
                        required
                      />
                      <input
                        type="text"
                        name="complemento"
                        placeholder="Complemento (opcional)"
                        value={editFields.complemento}
                        onChange={handleEditChange}
                        className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm mb-1"
                      />
                      <textarea
                        name="observacoes"
                        placeholder="Observações (opcional)"
                        value={editFields.observacoes}
                        onChange={handleEditChange}
                        className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none mb-1"
                        rows={1}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FaCheckCircle className="text-green-400 text-xl" />
                        <span className="font-medium text-gray-800 dark:text-gray-100 text-base">
                          {new Date(a.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">{new Date(a.createdAt).toLocaleTimeString('pt-BR')}</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">{a.endereco}</span>
                      {a.complemento && <span className="text-xs text-gray-400">{a.complemento}</span>}
                      {a.observacoes && <span className="text-xs text-gray-400 italic">{a.observacoes}</span>}
                    </div>
                  )}
                  <div className="flex gap-3 items-center mt-2 sm:mt-0">
                    {editIdx === i ? (
                      <>
                        <button
                          onClick={() => handleEditSave(i)}
                          className="text-green-600 hover:text-green-800 transition-colors text-xl"
                          title="Salvar"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(i)}
                          className="text-blue-500 hover:text-blue-700 transition-colors text-xl"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(i)}
                          className="text-red-500 hover:text-red-700 transition-colors text-xl"
                          title="Cancelar agendamento"
                        >
                          <FaTrashAlt />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ColetaAgendadaPage; 