import {
    View,
    Text,
    SectionList,
    Alert,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback, useLayoutEffect } from "react";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const baseURL = "http://10.0.2.2:8081";
const noImage = require("../../../assets/noImage.gif");

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProdutoList({ navigation }) {
    // ... (Todo o código da lógica permanece IDÊNTICO ao anterior) ...
    // Estou omitindo a lógica aqui para focar onde mudou: nos ESTILOS lá embaixo.

    const [secoes, setSecoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriasFechadas, setCategoriasFechadas] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            // Define o botão do lado direito
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProdutoCadastro")}
                    style={styles.headerButton} // Usando um estilo daqui
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchAllproduto = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/categoria`);
            const todosIdsCategorias = res.data.map((cat) => cat.id_categoria);
            setCategoriasFechadas(todosIdsCategorias);
            const dadosFormatados = res.data.map((categoria) => ({
                title: categoria.nome,
                data: categoria.produtos || [],
                id_categoria: categoria.id_categoria,
            }));
            setSecoes(dadosFormatados);
            setLoading(false);
        } catch (err) {
            console.log("Erro ao buscar:", err);
            Alert.alert("Erro", "Não foi possível carregar os produtos.");
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAllproduto();
        }, [])
    );

    const handleDelete = async (id) => {
        Alert.alert("Excluir", "Deseja apagar este produto?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sim, Excluir",
                onPress: async () => {
                    try {
                        await axios.delete(`${baseURL}/produto/${id}`);
                        fetchAllproduto();
                    } catch (err) {
                        Alert.alert("Erro", "Não foi possível excluir.");
                    }
                },
            },
        ]);
    };

    const toggleCategoria = (idCategoria) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (categoriasFechadas.includes(idCategoria)) {
            setCategoriasFechadas(
                categoriasFechadas.filter((id) => id !== idCategoria)
            );
        } else {
            setCategoriasFechadas([...categoriasFechadas, idCategoria]);
        }
    };

    function ProductCard({ data }) {
        const imageSource = data.imagem
            ? { uri: `${baseURL}/uploads/${data.imagem}` }
            : noImage;
        const precoFormatado = parseFloat(data.preco || 0)
            .toFixed(2)
            .replace(".", ",");

        return (
            <View style={styles.card}>
                <Image source={imageSource} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{data.nome}</Text>
                    <Text style={styles.cardPrice}>R$ {precoFormatado}</Text>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {data.descricao}
                    </Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={[styles.btnAction, styles.btnEdit]}
                        onPress={() => navigation.navigate("ProdutoEdit", data)}
                    >
                        <MaterialIcons name="edit" size={20} color="#fff" />
                        <Text style={styles.btnText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnAction, styles.btnDelete]}
                        onPress={() => handleDelete(data.id_produto)}
                    >
                        <MaterialIcons name="delete" size={20} color="#fff" />
                        <Text style={styles.btnText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#3498db"
                    style={{ marginTop: 50 }}
                />
            ) : (
                <SectionList
                    sections={secoes.map((secao) => ({
                        ...secao,
                        data: categoriasFechadas.includes(secao.id_categoria)
                            ? []
                            : secao.data,
                    }))}
                    keyExtractor={(item) => String(item.id_produto)}
                    renderItem={({ item }) => <ProductCard data={item} />}
                    renderSectionHeader={({ section }) => {
                        const estaFechada = categoriasFechadas.includes(
                            section.id_categoria
                        );
                        return (
                            <TouchableOpacity
                                style={styles.sectionHeaderTouchable}
                                onPress={() =>
                                    toggleCategoria(section.id_categoria)
                                }
                                activeOpacity={0.7}
                            >
                                <View style={styles.sectionHeaderContent}>
                                    <Text style={styles.sectionHeaderText}>
                                        {section.title}
                                    </Text>
                                    <MaterialIcons
                                        name={
                                            estaFechada
                                                ? "keyboard-arrow-down"
                                                : "keyboard-arrow-up"
                                        }
                                        size={24}
                                        color="#555"
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    stickySectionHeadersEnabled={true}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Nenhuma categoria ou produto encontrado.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

// ==========================================
// === AS MUDANÇAS ESTÃO AQUI NOS ESTILOS ===
// ==========================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        backgroundColor: "#fff",
        padding: 15,
        paddingTop: 20, // Um pouco mais de espaço no topo
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        // MUDANÇA 1: Alinha o texto à esquerda (início)
        alignItems: "flex-start",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24, // Aumentei um pouco a fonte
        fontWeight: "bold",
        color: "#333",
    },
    // ... (estilos de sectionHeader e card permanecem iguais) ...
    sectionHeaderTouchable: {
        backgroundColor: "#f9f9f9",
        marginBottom: 5,
        elevation: 2,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        
    },
    sectionHeaderContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderLeftWidth: 5,
        borderLeftColor: "#d877e0",
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 3,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    cardPrice: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2ecc71",
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: "#777",
    },
    cardActions: {
        flexDirection: "row",
        gap: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        padding: 10,
    },
    btnAction: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
    },
    btnEdit: {
        backgroundColor: "#3498db",
    },
    btnDelete: {
        backgroundColor: "#e74c3c",
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 5,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
    },
    // MUDANÇA 2: Reposicionamento do Botão Flutuante
    fab: {
        position: "absolute",
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        // MUDOU AQUI: Em vez de 'bottom', usamos 'top'
        top: 15,
        right: 15,
        backgroundColor: "#2ecc71",
        borderRadius: 30,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 10, // Garante que ele fique na frente do texto
    },
    headerButton: {
        backgroundColor: "#2ecc71",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 0, // O header nativo já dá um espacinho
    },
});
