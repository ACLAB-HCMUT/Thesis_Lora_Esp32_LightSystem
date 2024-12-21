import AppTheme from "../shared-theme/AppTheme";
import { Container, CssBaseline } from "@mui/material";
import AppAppBar from "../blog/components/AppAppBar";
import { useEffect } from "react";
import { configAxios } from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { getprofile } from "../../redux/slice/user/signinSlice";
import { RootState } from "../../redux/store";
const Main = (props: { disableCustomTheme?: boolean }) => {
  const dispatch = useDispatch();
  const token = useSelector((root: RootState) => root.user.signin.accessToken);
  console.log(token, "check token");
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await configAxios.get("auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(getprofile(response.data));
      console.log(response, "response data");
    };
    if (token) {
      fetchUserData();
    }
  });
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        {/* <Author authors={cardData[0].authors}></Author> */}
        {/* <MainContent /> */}
      </Container>
      {/* <Footer /> */}
    </AppTheme>
  );
};

export default Main;
