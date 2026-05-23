import { useGetAllProductsQuery } from "../../redux/features/product/productApi";
import Loader from "../ui/Loader";
import ProductCard from "../ui/ProductCard";

const Products = () => {
  const { data, isLoading } = useGetAllProductsQuery();

  const products = data?.products?.data;

  if (isLoading) return <Loader />;

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-lg font-medium">No products found.</h1>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-5 lg:px-10 py-10">
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          md:gap-5
          gap-8
        "
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
