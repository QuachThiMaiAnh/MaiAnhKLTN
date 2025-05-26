export const saveUserToDatabase = async (userId: string, userInfo?: any) => {
  try {
    if (!userId) {
      // console.log(userId);
      console.error("No userId provided");
      return;
    }

    const requestBody: any = { clerkId: userId };

    // Kiểm tra và thêm thông tin nếu có
    if (userInfo?.phone) requestBody.phone = userInfo.phone;
    if (userInfo?.gender) requestBody.gender = userInfo.gender;
    if (userInfo?.birthdate) requestBody.birthdate = userInfo.birthdate;
    if (userInfo?.address) requestBody.address = userInfo.address;
    if (userInfo?.paymentInfo) requestBody.paymentInfo = userInfo.paymentInfo;
    if (userInfo?.orders) requestBody.orders = userInfo.orders;

    const response = await fetch("http://localhost:8080/api/users/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId: userId }),
    });

    const data = await response.json();

    return data?.user;
  } catch (error) {
    console.error("Error during saveUserToDatabase:", error);
  }
};
