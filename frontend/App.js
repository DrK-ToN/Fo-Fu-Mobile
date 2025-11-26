import React from "react";
// 1. Importações Essenciais da Navegação
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 2. Importação de TODAS as suas telas
// (Verifique se os caminhos estão corretos no seu projeto)
import Home from "./src/pages/Home";
import ProdutoList from "./src/pages/Produto/ProdutoList";
import ProdutoCadastro from "./src/pages/Produto/ProdutoCadastro";
import ProdutoEdit from "./src/pages/Produto/ProdutoEdit";
import CategoriaList from "./src/pages/Categorias/CategoriaList";
import CategoriaCadastro from "./src/pages/Categorias/CategoriaCadastro";

// 3. Cria o objeto da Pilha Nativa
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        // O NavigationContainer deve envolver tudo
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home" // Define que a HOME é a primeira tela
                screenOptions={{
                    // Estilo padrão para a barra superior (Header) de todas as telas

                    headerStyle: { backgroundColor: "#a65bad" },
                    headerTintColor: "#fff",
                    headerTitleStyle: { fontWeight: "bold", fontSize: 16 },
                    headerTitleAlign: "center",
                }}
            >
                {/* === A BASE DA PILHA === */}
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: "Página Inicial" }}
                />

                {/* === TELAS DE PRODUTOS === */}
                <Stack.Screen
                    name="ProdutoList"
                    component={ProdutoList}
                    options={{ title: "Lista de Produtos" }}
                />
                <Stack.Screen
                    name="ProdutoCadastro"
                    component={ProdutoCadastro}
                    options={{ title: "Novo Produto" }}
                />
                <Stack.Screen
                    name="ProdutoEdit"
                    component={ProdutoEdit}
                    options={{ title: "Editar Produto" }}
                />

                {/* === TELAS DE CATEGORIAS === */}
                <Stack.Screen
                    name="CategoriaList"
                    component={CategoriaList}
                    options={{ title: "Gerenciar Categorias" }}
                />
                <Stack.Screen
                    name="CategoriaCadastro"
                    component={CategoriaCadastro}
                    options={{ title: "Categoria" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
