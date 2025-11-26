import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
// 1. Importar Picker
import { Picker } from "@react-native-picker/picker";

const baseURL = "http://10.0.2.2:8081";

export default function ProdutoEdit({ route, navigation }) {
    const id = route.params.id_produto;

    const [nome, setNome] = useState(route.params.nome);
    const [preco, setPreco] = useState(String(route.params.preco || ""));
    const [descricao, setDescricao] = useState(route.params.descricao);

    // 2. States da Categoria
    // Inicializa com o ID que veio da lista, ou string vazia se for nulo
    const [categoriaId, setCategoriaId] = useState(
        route.params.id_categoria || ""
    );
    const [listaCategorias, setListaCategorias] = useState([]);

    const [imagemSelecionada, setImagemSelecionada] = useState(null);
    const imagemAntiga = route.params.imagem;
    const noImage = require("../../../assets/noImage.gif");

    // 3. Buscar a lista de categorias ao abrir a tela
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/produto/categorias`
                );
                setListaCategorias(response.data);
            } catch (error) {
                console.log("Erro ao buscar categorias:", error);
            }
        };
        fetchCategorias();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagemSelecionada(result.assets[0].uri);
        }
    };

    const alterarDados = async () => {
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("preco", preco);
        formData.append("descricao", descricao);

        // 4. Enviar a categoria escolhida
        if (categoriaId) {
            formData.append("id_categoria", categoriaId);
        }

        if (imagemSelecionada) {
            let filename = imagemSelecionada.split("/").pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append("file", {
                uri: imagemSelecionada,
                name: filename,
                type: type,
            });
        }

        try {
            await axios.put(`${baseURL}/produto/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Alert.alert("Sucesso", "Produto alterado com sucesso!");
            navigation.navigate("ProdutoList"); // Força o refresh da lista
        } catch (error) {
            console.log("ERRO AO EDITAR:", error);
            Alert.alert("Erro", "Erro ao alterar o produto.");
        }
    };

    const renderImagem = () => {
        if (imagemSelecionada) {
            return { uri: imagemSelecionada };
        } else if (imagemAntiga) {
            return { uri: `${baseURL}/uploads/${imagemAntiga}` };
        } else {
            return noImage;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>ID do Produto: {id}</Text>

            <View style={{ alignItems: "center", marginBottom: 20 }}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={renderImagem()} style={styles.image} />
                </TouchableOpacity>
                <Text style={{ marginTop: 5, color: "blue" }}>
                    Toque para alterar imagem
                </Text>
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
            />

            <Text style={styles.label}>Preço</Text>
            <TextInput
                style={styles.input}
                value={preco}
                onChangeText={setPreco}
                keyboardType="numeric"
            />

            {/* 5. UI do Picker (Igual ao Cadastro) */}
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(itemValue) => setCategoriaId(itemValue)}
                >
                    <Picker.Item label="Sem Categoria" value="" />
                    {listaCategorias.map((item) => (
                        <Picker.Item
                            key={item.id_categoria}
                            label={item.nome}
                            value={item.id_categoria}
                        />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
                style={styles.input}
                value={descricao}
                onChangeText={setDescricao}
                multiline={true}
                numberOfLines={3}
            />

            <TouchableOpacity style={styles.button} onPress={alterarDados}>
                <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, backgroundColor: "#f5f5f5" },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        resizeMode: "cover",
    },

    // Estilo do Picker Container
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#fff",
    },

    button: {
        backgroundColor: "#3498db",
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
