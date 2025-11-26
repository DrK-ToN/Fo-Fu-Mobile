import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import axios from "axios";

const baseURL = "http://10.0.2.2:8081";

export default function CategoriaForm({ route, navigation }) {
    // Se vier 'params', é Edição. Se não, é Cadastro.
    const itemEditar = route.params;

    const [nome, setNome] = useState(itemEditar ? itemEditar.nome : "");

    const handleSave = async () => {
        if (!nome.trim()) {
            Alert.alert("Erro", "Preencha o nome da categoria");
            return;
        }

        try {
            if (itemEditar) {
                // MODO EDIÇÃO (PUT)
                await axios.put(
                    `${baseURL}/categoria/${itemEditar.id_categoria}`,
                    { nome }
                );
                Alert.alert("Sucesso", "Categoria atualizada!");
            } else {
                // MODO CRIAÇÃO (POST)
                await axios.post(`${baseURL}/categoria`, { nome });
                Alert.alert("Sucesso", "Categoria criada!");
            }
            navigation.goBack(); // Volta para a lista
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar categoria.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome da Categoria</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Ex: Infantil"
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>
                    {itemEditar ? "Salvar Alterações" : "Cadastrar"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#2ecc71",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
