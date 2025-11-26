import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const baseURL = "http://10.0.2.2:8081";

export default function CategoriaList({ navigation }) {
    const [categorias, setCategorias] = useState([]);

    const fetchCategorias = async () => {
        try {
            const res = await axios.get(`${baseURL}/categoria`);
            setCategorias(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCategorias();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert("Excluir", "Tem certeza?", [
            { text: "Cancelar" },
            {
                text: "Sim",
                onPress: async () => {
                    try {
                        await axios.delete(`${baseURL}/categoria/${id}`);
                        fetchCategorias();
                    } catch (error) {
                        Alert.alert(
                            "Erro",
                            "Não é possível excluir categorias que têm produtos!"
                        );
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={categorias}
                keyExtractor={(item) => String(item.id_categoria)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nome}>{item.nome}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "CategoriaCadastro",
                                        item
                                    )
                                }
                            >
                                <MaterialIcons
                                    name="edit"
                                    size={24}
                                    color="orange"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id_categoria)}
                            >
                                <MaterialIcons
                                    name="delete"
                                    size={24}
                                    color="red"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Botão Flutuante para Adicionar */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("CategoriaCadastro")}
            >
                <MaterialIcons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: "#d877e0",
        elevation: 2,
    },
    nome: { fontSize: 18, fontWeight: "bold" },
    actions: { flexDirection: "row", gap: 15 },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#2ecc71",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
});
