import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  // Novos campos para coleta de dados
  const [agua, setAgua] = useState('');
  const [exercicio, setExercicio] = useState('');
  const [calorias, setCalorias] = useState('');

  // Caso haja um registro em edição, preenche os campos com os dados existentes
  useEffect(() => {
    if (registroEmEdicao) {
      setAgua(registroEmEdicao.agua.toString());
      setExercicio(registroEmEdicao.exercicio.toString());
      setCalorias(registroEmEdicao.calorias.toString());
    }
  }, [registroEmEdicao]);

  const handleSave = () => {
    // Conversão dos valores para número
    const aguaNum = parseFloat(agua);
    const exercicioNum = parseFloat(exercicio);
    const caloriasNum = parseFloat(calorias);

    // Validação dos dados de entrada
    if (isNaN(aguaNum) || isNaN(exercicioNum) || isNaN(caloriasNum)) {
      return Alert.alert("Erro de Validação", "Por favor, insira valores numéricos válidos.");
    }

    if (aguaNum <= 0 || exercicioNum <= 0 || caloriasNum <= 0) {
      return Alert.alert("Erro de Validação", "Os valores devem ser maiores que zero.");
    }

    // Se passar pelas validações, cria o novo registro com a data
    const novoRegistro = {
      id: new Date().getTime(), // Gera um ID único baseado no timestamp
      data: new Date().toLocaleDateString('pt-BR'), // Data no formato DD/MM/AAAA
      agua: aguaNum,
      exercicio: exercicioNum,
      calorias: caloriasNum,
    };

    // Chama a função de salvar com os novos valores
    onSave(novoRegistro);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.titulo}>Registre seu dia no Diário Fit 💪</Text>

      <Text style={styles.label}>Quantos litros de água você bebeu hoje?</Text>
      <TextInput
        style={styles.input}
        value={agua}
        onChangeText={setAgua}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantos minutos de exercício você fez hoje?</Text>
      <TextInput
        style={styles.input}
        value={exercicio}
        onChangeText={setExercicio}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantas calorias você consumiu hoje?</Text>
      <TextInput
        style={styles.input}
        value={calorias}
        onChangeText={setCalorias}
        keyboardType="numeric"
      />

      <View style={styles.buttonsContainer}>
        <Button title="Salvar" onPress={handleSave} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    margin: 20,
    backgroundColor: '#e0f7fa', // Fundo azul bem clarinho
    padding: 15,
    borderRadius: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#00838f', // Azul mais forte para o título
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: '#006064', // Cor de texto mais escura para as labels
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    padding: 5,
    borderColor: '#00838f', // Borda do input na cor azul
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
