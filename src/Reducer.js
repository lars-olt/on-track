var tempClasses;

export const initialState = {
  user: null,
  classes: [],
  font: '',
  pallet: 1,
  url: '',
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_CLASSES: "SET_CLASSES",
  ADD_CLASS: "ADD_CLASS",
  DELETE_CLASS: "DELETE_CLASS",
  UPDATE_TASK: "UPDATE_TASK",
  UPDATE_FONT: "UPDATE_FONT",
  UPDATE_PALLET: "UPDATE_PALLET",
  UPDATE_URL: "UPDATE_URL",

};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case actionTypes.SET_CLASSES:
      return {
        ...state,
        classes: action.classes,
      };

    case actionTypes.ADD_CLASS:
      return {
        ...state,
        classes: [...state.classes, action.class],
      };
    
    case actionTypes.DELETE_CLASS:
      tempClasses = [...state.classes];

      const index = state.classes.findIndex((task) => task.id === action.id);

      if (index >= 0) {
        tempClasses.splice(index, 1);
      } else {
        console.warn(
          `Can't remove class (id: ${action.id}) as it's not listed.`
        );
      }

      return {
        ...state,
        classes: tempClasses,
      };

    case actionTypes.UPDATE_TASK:
      tempClasses = [...state.classes];

      var cardIndex = state.classes.findIndex(
        (item) => item.id === action.taskId
      );

      tempClasses[cardIndex].todo = action.newTodo;

      return {
        ...state,
        classes: tempClasses,
      };

    case actionTypes.UPDATE_FONT:
      return {
        ...state,
        font: [action.font],
      }

    case actionTypes.UPDATE_PALLET:
      return {
        ...state,
        pallet: [action.pallet],
      }

    case actionTypes.UPDATE_URL:
      return {
        ...state,
        url: [action.url],
      }

    default:
      return state;
  }
};

export default reducer;
