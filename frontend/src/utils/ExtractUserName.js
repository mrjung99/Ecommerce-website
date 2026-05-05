const extractName = (data) => {
  if (!data) return "";
  if (data?.data?.profile?.firstName && data?.data?.profile?.lastName) {
    return data.data.profile.firstName + " " + data.data.profile.lastName;
  }

  return data.data.userName;
};

export default extractName;
