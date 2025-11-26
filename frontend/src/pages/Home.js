import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text
                    style={{
                        color: "#4182b4ff",
                        fontSize: 24,
                        fontWeight: "bold",
                    }}
                >
                    Bem-vindo a
                </Text>
                <Image
                    source={require("../../assets/fofu.png")}
                    style={styles.image}
                />

                <View style={styles.buttonContainer}>
                    {/* Botão que navega para a lista de Produtos */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("ProdutoList")} // Usa o nome definido no App.js
                    >
                        <Text style={styles.buttonText}>Listar Produtos</Text>
                    </TouchableOpacity>

                    {/* Botão que navega para a lista de Categorias */}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("CategoriaList")}
                    >
                        <Text style={styles.buttonText}>
                            Gerenciar Categorias
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7dbecff",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        color: "#ffffffff",
        marginBottom: 20,
    },
    buttonContainer: {
        flex: 0.5,
        width: "100%",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#d877e0",
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "#a06fa3",
        width: "80%",
        paddingVertical: 15, // Altura interna
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    image: {
        width: "100%",
        height: 230,
    },
});

export default Home;
