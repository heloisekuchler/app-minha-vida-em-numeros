import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import Grafico from './components/Grafico'; // Importação do componente Grafico

export default function App() {
  const [registros, setRegistros] = useState([]); // Estado para armazenar os registros
  const [ordenacao, setOrdenacao] = useState('recentes'); // Estado para controlar a ordenação
  const [registroEmEdicao, setRegistroEmEdicao] = useState(null); // Estado para o registro em edição

  // Carrega os registros ao iniciar o app
  useEffect(() => {
    const carregar = () => {
      const dados = [
        { id: 1, agua: 2, exercicio: 30, calorias: 500 },
        { id: 2, agua: 1.5, exercicio: 45, calorias: 600 },
        { id: 3, agua: 3, exercicio: 25, calorias: 450 },
      ];
      setRegistros(dados);
    };
    carregar();
  }, []);

  // Função para salvar ou atualizar um registro
  const handleSave = (novoRegistro) => {
    if (registroEmEdicao) {
      // Atualizar registro
      const registrosAtualizados = registros.map((registro) =>
        registro.id === registroEmEdicao.id ? { ...registro, ...novoRegistro } : registro
      );
      setRegistros(registrosAtualizados);
      Alert.alert('Sucesso!', 'Registro atualizado!');
    } else {
      // Criar novo registro
      const novoRegistroComId = { ...novoRegistro, id: new Date().getTime() };
      setRegistros((prevRegistros) => [...prevRegistros, novoRegistroComId]);
      Alert.alert('Sucesso!', 'Registro salvo!');
    }
    setRegistroEmEdicao(null); // Limpar estado de edição
  };

  // Função para deletar um registro
  const handleDelete = (id) => {
    setRegistros((prevRegistros) => {
      const novosRegistros = prevRegistros.filter((registro) => registro.id !== id);
      Alert.alert('Sucesso!', 'O registro foi deletado.');
      return novosRegistros;
    });
  };

  // Função para iniciar a edição de um registro
  const handleIniciarEdicao = (registro) => {
    setRegistroEmEdicao(registro);
  };

  // Função para cancelar a edição
  const handleCancelarEdicao = () => {
    setRegistroEmEdicao(null);
  };

  // Ordenação dos registros conforme o estado `ordenacao`
  let registrosExibidos = [...registros]; // Trabalhando com uma cópia do array para evitar mutação do estado original

  if (ordenacao === 'maior_agua') {
    registrosExibidos.sort((a, b) => b.agua - a.agua);
  } else {
    registrosExibidos.sort((a, b) => b.id - a.id);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Diario Fit 💪</Text>

      {/* Exibir gráfico */}
      <Grafico registros={registrosExibidos} />

      {/* Botões de ordenação */}
      <View style={styles.botoesOrdenacao}>
        <Button title="Mais Recentes" onPress={() => setOrdenacao('recentes')} />
        <Button title="Maior Valor (Água)" onPress={() => setOrdenacao('maior_agua')} />
      </View>

      {/* Formulário para adicionar um novo registro ou editar */}
      <Formulario
        onSave={handleSave}
        onCancel={handleCancelarEdicao}
        registroEmEdicao={registroEmEdicao}
      />

      {/* Lista de registros, agora com dados ordenados */}
      <ListaRegistros
        registros={registrosExibidos}
        onDelete={handleDelete}
        onEdit={handleIniciarEdicao}
      />
    </View>
  );
}

const Formulario = ({ onSave, onCancel, registroEmEdicao }) => {
  const [agua, setAgua] = useState('');
  const [exercicio, setExercicio] = useState('');
  const [calorias, setCalorias] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setAgua(registroEmEdicao.agua.toString());
      setExercicio(registroEmEdicao.exercicio.toString());
      setCalorias(registroEmEdicao.calorias.toString());
    }
  }, [registroEmEdicao]);

  const handleSubmit = () => {
    const novoRegistro = {
      agua: parseFloat(agua),
      exercicio: parseInt(exercicio),
      calorias: parseInt(calorias),
    };
    onSave(novoRegistro);
    setAgua('');
    setExercicio('');
    setCalorias('');
  };

  return (
    <View style={styles.formulario}>
      <TextInput
        style={styles.input}
        placeholder="Água (litros)"
        value={agua}
        onChangeText={setAgua}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Exercício (minutos)"
        value={exercicio}
        onChangeText={setExercicio}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Calorias"
        value={calorias}
        onChangeText={setCalorias}
        keyboardType="numeric"
      />
      <Button title={registroEmEdicao ? 'Editar Registro' : 'Salvar Registro'} onPress={handleSubmit} />
      {registroEmEdicao && <Button title="Cancelar Edição" onPress={onCancel} />}
    </View>
  );
};

const ListaRegistros = ({ registros, onDelete, onEdit }) => {
  return (
    <View style={styles.lista}>
      {registros.map((registro) => (
        <View key={registro.id} style={styles.registroItem}>
          <Text>Água: {registro.agua}L | Exercício: {registro.exercicio}min | Calorias: {registro.calorias}</Text>
          <Button title="Editar" onPress={() => onEdit(registro)} />
          <Button title="Deletar" onPress={() => onDelete(registro.id)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#00838f',
  },
  botoesOrdenacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  formulario: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  lista: {
    marginTop: 20,
  },
  registroItem: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
