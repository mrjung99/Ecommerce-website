const truncateName = (name, length) => {
  if (name.length > length) {
    let newName = "";
    for (let i = 0; i < length; i++) {
      newName += name[i];
    }
    return newName + "...";
  }

  return name;
};

export default truncateName;
