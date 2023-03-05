import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
  },
  scrollContainer: {
    margin: 2,
  },
  textInputContainer: {
    minWidth: 60,
    height: 32,
    margin: 2
  },

  textInput: {
    margin: 0,
    padding: 0,
    paddingLeft: 12,
    paddingRight: 12,
    flex: 1,
    height: 32,
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.87)",
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 20
  },

  tag: {
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 12,
    height: 32,
    margin: 4
  },
  tagLabel: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.87)"
  }
});
