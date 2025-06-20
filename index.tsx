// App.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type Registro = {
  id: string;
  nome: string;
  material: string;
  dataHora: string;
};

export default function App() {
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("");
  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function salvarRegistro() {
    if (!nome.trim() || !material.trim()) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos!");
      return;
    }

    const dataHoraAtual = new Date().toLocaleString();
    const novoRegistro = {
      id: Date.now().toString(),
      nome,
      material,
      dataHora: dataHoraAtual,
    };

    setRegistros((prevRegistros) => {
      const novaLista = [...prevRegistros, novoRegistro];
      AsyncStorage.setItem("registros", JSON.stringify(novaLista));
      return novaLista;
    });
    setNome("");
    setMaterial("");
    Alert.alert("Sucesso", "Registro salvo com sucesso!");
  }

  async function carregarDados() {
    const dados = await AsyncStorage.getItem("registros");
    if (dados) {
      setRegistros(JSON.parse(dados));
    }
  }

  // Função simplificada para deletar diretamente
  const handleDelete = (id: string) => {
    setRegistros((prevRegistros) => {
      const novaLista = prevRegistros.filter((registro) => registro.id !== id);
      AsyncStorage.setItem("registros", JSON.stringify(novaLista));
      return novaLista;
    });
  };

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Comunidade Solidária</Text>
            <Text style={styles.subtitulo}>
              Registro de Materiais Didáticos
            </Text>
          </View>

          <View style={styles.card}>
            <TextInput
              placeholder="Nome do participante"
              placeholderTextColor="#999"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              placeholder="Material recebido"
              placeholderTextColor="#999"
              style={styles.input}
              value={material}
              onChangeText={setMaterial}
            />

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvarRegistro}
            >
              <Text style={styles.textoBotao}>Salvar Registro</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Registros Salvos</Text>

          {registros.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="inventory" size={60} color="#FFC107" />
              <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
            </View>
          ) : (
            registros.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.itemContent}>
                  <Text style={styles.textoItem}>
                    <Text style={styles.label}>Nome:</Text> {item.nome}
                  </Text>
                  <Text style={styles.textoItem}>
                    <Text style={styles.label}>Material:</Text> {item.material}
                  </Text>
                  <Text style={styles.textoItem}>
                    <Text style={styles.label}>Data:</Text> {item.dataHora}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Icon name="delete" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitulo: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#333",
  },
  botaoSalvar: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  textoBotao: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  item: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  textoItem: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    textAlign: "center",
  },
});
