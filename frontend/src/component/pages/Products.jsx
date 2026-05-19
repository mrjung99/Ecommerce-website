import { useGetAllProductsQuery } from "../../redux/features/product/productApi";
import Loader from "../ui/Loader";
import ProductCard from "../ui/ProductCard";

const Products = () => {
  const { data, isLoading } = useGetAllProductsQuery();
  const products = data?.products;

  if (isLoading) return <Loader />;

  if (!products) {
    return (
      <div className="flex items-center justify-center">
        <h1>No product..</h1>
      </div>
    );
  }

  return (
    <div className="flex gap-5 my-10 w-11/12 mx-auto">
      <div className="grid grid-cols-4 gap-5">
        {products?.data?.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
};

export default Products;
