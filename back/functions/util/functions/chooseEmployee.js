const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const compareEmployee = (employee1, employee2) => {
  let currentDate = new Date().getTime();

  if (employee1.lastWorked && employee2.lastWorked) {
    let waiting1 = currentDate - employee1.lastWorked.getTime();
    let waiting2 = currentDate - employee2.lastWorked.getTime();

    return waiting2 - waiting1;
  } else {
    if (!employee1.lastWorked) {
      return -1;
    } else {
      return 1;
    }
  }
};

exports.chooseEmployee = (employees) => {
  employees = shuffle(employees);

  employees.sort((a, b) => compareEmployee(a, b));

  return employees[0];
};
