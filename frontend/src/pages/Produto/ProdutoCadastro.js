import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
// 1. IMPORTAR O PICKER
import { Picker } from "@react-native-picker/picker";

// LEMBRE-SE DO IP CORRETO (Se estiver no emulador Android, use 10.0.2.2)
const baseURL = "http://10.0.2.2:8081";

export default function ProdutoCadastro({ navigation }) {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagemSelecionada, setImagemSelecionada] = useState(null);

    // 2. NOVOS STATES PARA CATEGORIA
    const [categoriaId, setCategoriaId] = useState(""); // Guarda o ID escolhido
    const [listaCategorias, setListaCategorias] = useState([]); // Guarda a lista que veio do banco

    const noImage = require("../../../assets/noImage.gif");

    // 3. BUSCAR AS CATEGORIAS ASSIM QUE A TELA CARREGA
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                // CORREÇÃO 1: A rota correta para buscar categorias é /categoria
                const response = await axios.get(`${baseURL}/categoria`);
                setListaCategorias(response.data);
            } catch (error) {
                console.log("Erro ao buscar categorias:", error);
                Alert.alert("Erro", "Não foi possível carregar as categorias");
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

    const handleCadastro = async () => {
        // Validação simples
        if (!nome || !preco) {
            Alert.alert("Atenção", "Nome e Preço são obrigatórios.");
            return;
        }

        if (!categoriaId) {
            Alert.alert("Atenção", "Por favor, selecione uma categoria.");
            return;
        }

        // Validação de preço para garantir que é um número
        if (isNaN(parseFloat(preco))) {
            Alert.alert("Erro", "O preço deve ser um número válido.");
            return;
        }

        const formData = new FormData();
        formData.append("nome", nome);
        // Envia o preço como string para o backend converter se necessário
        formData.append("preco", preco);
        formData.append("descricao", descricao);
        // O PULO DO GATO: Envia o ID da categoria selecionada
        formData.append("id_categoria", categoriaId);

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
            await axios.post(`${baseURL}/produto`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Alert.alert("Sucesso", "Produto cadastrado!");
            // CORREÇÃO 3: Usa goBack() para voltar para a lista e forçar a atualização lá
            navigation.goBack();
        } catch (error) {
            console.log("Erro ao cadastrar:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o produto.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                <Image
                    source={
                        imagemSelecionada ? { uri: imagemSelecionada } : noImage
                    }
                    style={styles.image}
                />
                <Text style={styles.imageText}>Toque para adicionar foto</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput
                placeholder="Ex: Bolsa de Crochê"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
            />

            <Text style={styles.label}>Preço</Text>
            <TextInput
                placeholder="90.00"
                value={preco}
                onChangeText={setPreco}
                keyboardType="numeric"
                style={styles.input}
            />

            {/* 5. O COMPONENTE PICKER (DROPDOWN) */}
            <Text style={styles.label}>Categoria</Text>
            {/* CORREÇÃO 5: Adicionado estilo ao container do Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(itemValue) => setCategoriaId(itemValue)}
                >
                    <Picker.Item
                        label="Selecione uma categoria..."
                        value=""
                        color="#999" // Cor cinza para indicar placeholder
                        enabled={false} // Desabilita para não poder selecionar de volta
                    />
                    {/* Faz um loop na lista que veio do banco */}
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
                placeholder="Detalhes do produto..."
                value={descricao}
                onChangeText={setDescricao}
                style={[styles.input, styles.textArea]} // Combina estilos
                multiline={true}
                numberOfLines={3}
            />

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>Salvar Produto</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, backgroundColor: "#f5f5f5" },
    label: { fontWeight: "bold", marginBottom: 5, color: "#333", fontSize: 16 },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8, // Bordas mais arredondadas
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        fontSize: 16,
    },
    textArea: {
        height: 100, // Altura maior para descrição
        textAlignVertical: "top", // Alinha texto no topo no Android
        paddingVertical: 15,
    },
    imageContainer: { alignItems: "center", marginBottom: 25 },
    image: {
        width: 150, // Um pouco maior
        height: 150,
        borderRadius: 75,
        resizeMode: "cover",
        borderWidth: 3,
        borderColor: "#e0e0e0",
    },
    imageText: { marginTop: 10, color: "#3498db", fontWeight: "500" },

    // CORREÇÃO 5: Estilo para a caixa do Picker para combinar com os inputs
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: "#fff",
        justifyContent: "center", // Centraliza verticalmente o conteúdo do picker
        height: 50, // Mesma altura dos inputs
    },

    button: {
        backgroundColor: "#3498db",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        elevation: 3, // Sombra no Android
        shadowColor: "#000", // Sombra no iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
