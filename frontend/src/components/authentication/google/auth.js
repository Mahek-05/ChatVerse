const signUpGoogle = (accessToken) => API.post("/api/user", {
    googleAccessToken: accessToken
})

export const signupGoogle = (accessToken, navigate) => async (dispatch)=>{
    try{
        // signup user
        const {data} = await signUpGoogle(accessToken);

        // Store the user data in localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        // Set loading state to false
        setPicLoading(false);
        
        // Redirect to the chats page
        navigate("/chats");
    }catch(err){
        console.log(err);
    }
}