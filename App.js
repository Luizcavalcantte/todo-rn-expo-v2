import react, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import TaskList from "./src/components/Tasklist";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

//na const a baixo estamos juntando as propriedades do Animatable e TouchableOpacity e colocando no componente AnimatedBtn
const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  //useEffect fica de olho nos estados, pra executar uma ação.
  //useEffect se nao tiver os [colchetes] sempre que qualquer estado for atulaizado, oq estiver dentro das {chaves} sera executado.
  //useEffect se tiver um [colchetes] vazio, o useEffect sera executado apenas no inicio da aplicação.
  //useEffect se tiver um ou mais estados dentro dos [colchetes] sempre que um desses estados forem atualizados, oq estiver dentro das {chaves} sera executado.
  useEffect(() => {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem("task");

      if (taskStorage) {
        setTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTasks() {
      await AsyncStorage.setItem("task", JSON.stringify(task));
    }
    saveTasks();
  }, [task]);

  function hendleAdd() {
    if (input === "") return;

    const data = {
      // nesse caso a key pode ser o proprio input, pq dificilmente teriamos duas tarefas iguais,
      // se for o caso, poderiamos usar o Math.Randow para gerar a key, mas lembresse de usar o string(item.key) no keyExtractor na flatList
      key: input,
      task: input,
      completed: false,
    };

    // o formado[...task,data] faz com q preservemos os dados q ja temos na task, e adicionemos o obj data, como se fosse um +=
    setTask([...task, data]);
    setOpen(false);
    setInput("");
  }

  const markTodoComplete = (todoKey) => {
    const find = task.map((item) => {
      if (item.key === todoKey) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setTask(find);
  };

  const handleDelete = useCallback((data) => {
    const find = task.filter((r) => r.key !== data.key);

    Alert.alert("Deseja apagar esta tarefa?", "", [
      {
        text: "Sim",
        onPress: () => {
          setTask(find);
        },
      },
      { text: "Não" },
    ]);
  });

  const deleteAllTasks = () => {
    Alert.alert("Confirmação", "deseja apagar todas as tarefas?", [
      { text: "Sim", onPress: () => setTask([]) },
      { text: "Não" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#171d31" />
      <View style={styles.content}>
        <Text style={styles.title}>Lista de Tarefas</Text>
        <MaterialIcons
          name="delete-forever"
          size={30}
          color={"#fff"}
          onPress={deleteAllTasks}
          style={{ position: "absolute", right: 10, top: 10 }}
        />
      </View>
      <FlatList
        showsHorizontalScrollIndicator="false"
        data={task}
        // keyExtractor precisa receber o dado em forma de string
        keyExtractor={(item) => String(item.key)}
        //as chaves no {item} desconstroi o arrey, retornando um obj de cada vez,
        //obs caso colocar mais de uma ação dentro da function q retorna o componente, tem q usar o RETURN
        renderItem={({ item }) => (
          <TaskList
            data={item}
            handleDelete={handleDelete}
            markTodoComplete={markTodoComplete}
          />
        )}
        //essa propriedade handleDelete vai ser usada como referenica la no TaskList pra podermos usar nossa função
      />

      <Modal animationType="slide" visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons
                style={{ margin: 10 }}
                name="md-arrow-back"
                size={40}
                color="#fff"
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
          </View>
          <Animatable.View
            style={styles.modalBody}
            animation="fadeInUp"
            useNativeDriver
          >
            <TextInput
              //multiline faz com que quebre a linha ao chegar no final do input
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder="O que preciso fazer hoje"
              style={styles.input}
              value={input}
              onChangeText={(text) => setInput(text)}
            />
            <TouchableOpacity style={styles.handleAdd} onPress={hendleAdd}>
              <Text style={styles.hendleAddText}>Adicionar Tarefa</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <AnimatedBtn
        style={styles.fab}
        useNativeDriver
        animation="bounceInUp"
        duration={1500}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color={"#fff"} />
      </AnimatedBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#171d31",
  },
  title: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
  },
  fab: {
    backgroundColor: "#0094ff",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    right: 10,
    elevation: 2,
    zIndex: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
  },
  modal: {
    flex: 1,
    backgroundColor: "#171d31",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 23,
  },
  modalBody: {
    marginTop: 15,
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 9,
    borderRadius: 5,
    height: 85,
    textAlignVertical: "top",
    color: "#000",
  },
  handleAdd: {
    backgroundColor: "#fff",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  hendleAddText: {
    fontSize: 20,
  },
});
