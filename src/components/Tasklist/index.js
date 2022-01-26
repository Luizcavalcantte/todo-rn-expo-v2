import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

//data dentro das chaves é a desconstrução de props.data
export default function TaskList({ data, handleDelete, markTodoComplete }) {
  console.log(data);
  return (
    <Animatable.View
      style={styles.container}
      animation="bounceIn"
      useNativeDriver
    >
      <View>
        <Text
          style={
            (styles.task,
            {
              textDecorationLine: data.completed ? "line-through" : "none",
              color: data.completed ? "gray" : "#121212",
            })
          }
        >
          {data.task}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",

          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.btn}
          onPress={() => markTodoComplete(data.key)}
        >
          <FontAwesome
            name="check-square-o"
            size={30}
            color={data.completed ? "#121212" : "gray"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleDelete(data)}>
          <MaterialIcons name="delete" size={30} color={"#121212"} />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 7,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
  },
  task: {
    color: "#121212",
    fontSize: 20,
    paddingLeft: 8,
    paddingRight: 20,
  },
});
