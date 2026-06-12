import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLayout from "./component/common/PageLayout";
import Home from "./component/pages/Home";
import { useRefreshMutation } from "./redux/features/auth/authApi";
import Login from "./component/pages/Login";
import OauthCallBack from "./component/ui/OauthCallBack";
import {
  selectIsInitialized,
  setCredentials,
  setInitialized,
} from "./redux/features/auth/authSlice";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "./protected routes/ProtectedRoute";
import AdminLayout from "./component/pages/admin/AdminLayout";
import Register from "./component/pages/Register";
import Cart from "./component/pages/Cart";
import WishList from "./component/pages/WishList";
import Orders from "./component/pages/Orders";
import Profile from "./component/pages/Profile";
import Loader from "./component/ui/Loader";
import AdminRoute from "./protected routes/AdminRoute";
import AdminDashboard from "./component/pages/admin/pages/AdminDashboard";
import AdminProduct from "./component/pages/admin/pages/AdminProduct";
import Products from "./component/pages/Products";
import AdminUsers from "./component/pages/admin/pages/AdminUsers";
import AdminOrders from "./component/pages/admin/pages/AdminOrders";
import AdminPayment from "./component/pages/admin/pages/AdminPayment";

// ✅ Toast import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./component/pages/ProductDetails";
import AdminCategories from "./component/pages/admin/pages/AdminCategories";
import VerifyUser from "./component/pages/VerifyUser";

const router = createBrowserRouter([
  {
    path: "/oauth/callback",
    element: <OauthCallBack />,
  },
  {
    element: <PageLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/products", element: <Products /> },

      {
        path: "productDetails/:id",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <WishList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProduct /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "users", element: <AdminUsers /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "payment", element: <AdminPayment /> },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();
  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const data = await refresh().unwrap();
        dispatch(setCredentials(data));
      } catch {
        // no session
      } finally {
        dispatch(setInitialized());
      }
    };

    silentRefresh();
  }, []);

  if (!isInitialized) return <Loader />;

  return (
    <>
      {/* ✅ GLOBAL TOAST CONTAINER */}
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <RouterProvider router={router} />
    </>
  );
};

export default App;
