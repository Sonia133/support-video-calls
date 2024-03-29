export const ActionTypes = {
  USER: {
    SET_AUTHENTICATED: "USER.SET_AUTHENTICATED",
    SET_UNAUTHENTICATED: "USER.SET_UNAUTHENTICATED",
    SET_USER: "USER.SET_USER",
    SET_IMAGE: "USER.SET_IMAGE",
    SET_AVAILABILITY: "USER.SET_AVAILABILITY",
    LOADING_USER: "USER.LOADING_USER",
    STOP_LOADING_USER: "USER.STOP_LOADING_USER",
    LOADING_PICTURE: "USER.LOADING_PICTURE",
    STOP_LOADING_PICTURE: "USER.STOP_LOADING_PICTURE",
    LOADING_AVAILABILITY: "USER.LOADING_AVAILABILITY",
    STOP_LOADING_AVAILABILITY: "USER.STOP_LOADING_AVAILABILITY",
    VALIDATE_TOKEN: "USER.VALIDATE_TOKEN",
    SET_ERRORS: "USER.SET_ERRORS",
    CLEAR_ERRORS: "USER.CLEAR_ERRORS",
    ENROLL_COMPANY: "USER.ENROLL_COMPANY",
    ENROLL_COMPLETED: "USER.ENROLL_COMPLETED"
  },
  EMPLOYEE: {
    SET_EMPLOYEES: "EMPLOYEE.SET_EMPLOYEES",
    SET_EMPLOYEE: "EMPLOYEE.SET_EMPLOYEE",
    LOADING: "EMPLOYEE.LOADING",
    SET_ERRORS: "EMPLOYEE.SET_ERRORS",
    CLEAR_ERRORS: "EMPLOYEE.CLEAR_ERRORS",
    DELETE_EMPLOYEE: "EMPLOYEE.DELETE_EMPLOYEE"
  },
  CEO: {
    SET_CEOS: "CEO.SET_CEOS",
    SET_CEO: "CEO.SET_CEO",
    LOADING: "CEO.LOADING",
    SET_ERRORS: "CEO.SET_ERRORS",
    CLEAR_ERRORS: "CEO.CLEAR_ERRORS",
    DELETE_CEO: "CEO.DELETE_CEO"
  },
  CALL: {
    SET_EMPLOYEE: "CALL.SET_EMPLOYEE",
    LOADING_EMPLOYEE: "CALL.LOADING_EMPLOYEE",
    LOADING_CALLS: "CALL.LOADING_CALLS",
    SET_FEEDBACK: "CALL.SET_FEEDBACK",
    LOADING_FEEDBACK: "CALL.LOADING_FEEDBACK",
    SET_ERRORS_FEEDBACK: "CALL.SET_ERRORS_FEEDBACK",
    SET_ERRORS: "CALL.SET_ERRORS",
    SET_ERRORS_CALLS: "CALL.SET_ERRORS_CALLS",
    CLEAR_ERRORS: "CALL.CLEAR_ERRORS",
    CLEAR_ERRORS_CALLS: "CALL.CLEAR_ERRORS_CALLS",
    CLEAR_ERRORS_FEEDBACK: "CALL.CLEAR_ERRORS_FEEDBACK",
    END_CALL: "CALL.END_CALL",
    SET_CALLS: "CALL.SET_CALLS"
  },
  UI: {
    LOADING_UI: "UI.LOADING_UI",
    STOP_LOADING_UI: "UI.STOP_LOADING_UI",
    SET_ERRORS: "UI.SET_ERRORS",
    CLEAR_ERRORS: "UI.CLEAR_ERRORS"
  },
  GAME: {
    LOADING_MOVE: "GAME.LOADING_MOVE",
    SET_BOARD: "GAME.SET_BOARD",
    LOADING_BOARD: "GAME.LOADING_BOARD",
    STOP_LOADING_MOVE: "GAME.STOP_LOADING_MOVE",
  }
};
