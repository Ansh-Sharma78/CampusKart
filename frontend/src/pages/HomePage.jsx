import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  PackageSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getProducts } from "../features/products/productApi";
import { ProductCard } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton";

const heroSlides = [
  {
    image: "/hero/campus-marketplace.jpeg",
    eyebrow: "Student-only marketplace",
    title: "Buy and sell campus essentials faster.",
    description:
      "Find books, gadgets, cycles, notes, furniture, and hostel essentials from students around your campus.",
    actionLabel: "Browse listings",
    actionTo: "/products",
  },
  {
    image: "/hero/study-resources.jpeg",
    eyebrow: "Books, notes, and study resources",
    title: "Save money on semester materials.",
    description:
      "Discover second-hand textbooks, handwritten notes, lab files, and learning resources near you.",
    actionLabel: "Explore study deals",
    actionTo: "/products",
  },
  {
    image: "/hero/campus-shopping.jpg",
    eyebrow: "Campus commerce made simple",
    title: "Everything students need, in one place.",
    description:
      "A cleaner, safer marketplace experience designed for college communities.",
    actionLabel: "Start shopping",
    actionTo: "/products",
  },
];

const categoryHighlights = [
  "Books",
  "Notes",
  "Electronics",
  "Cycles",
  "Furniture",
  "Lab Equipment",
];

function EmptyProductsState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <PackageSearch size={26} aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-950">
        No listings yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Once sellers add products, they will appear here in the marketplace
        grid.
      </p>
    </div>
  );
}

export function HomePage() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const activeSlide = heroSlides[activeSlideIndex];

  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  function showPreviousSlide() {
    setActiveSlideIndex((currentIndex) =>
      currentIndex === 0 ? heroSlides.length - 1 : currentIndex - 1
    );
  }

  function showNextSlide() {
    setActiveSlideIndex((currentIndex) =>
      currentIndex === heroSlides.length - 1 ? 0 : currentIndex + 1
    );
  }

  useEffect(() => {
    const timerId = window.setInterval(() => {
      showNextSlide();
    }, 50000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoadingProducts(true);
        setErrorMessage("");

        const response = await getProducts();

        setProducts(response.data.data);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Unable to load products"
        );
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 shadow-xl">
        <div className="relative min-h-[420px]">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt=""
              className={[
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                index === activeSlideIndex ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/10" />

          <div className="relative z-10 flex min-h-[420px] max-w-3xl flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/20">
              <Sparkles size={16} aria-hidden="true" />
              {activeSlide.eyebrow}
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {activeSlide.title}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              {activeSlide.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={activeSlide.actionTo}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500"
              >
                {activeSlide.actionLabel}
              </Link>

              <Link
                to="/seller/products"
                className="rounded-full bg-white/95 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                Sell an item
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={showPreviousSlide}
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg transition hover:bg-white"
            aria-label="Previous hero slide"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={showNextSlide}
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg transition hover:bg-white"
            aria-label="Next hero slide"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActiveSlideIndex(index)}
                className={[
                  "h-2.5 rounded-full transition-all",
                  index === activeSlideIndex
                    ? "w-8 bg-emerald-400"
                    : "w-2.5 bg-white/70 hover:bg-white",
                ].join(" ")}
                aria-label={`Go to hero slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <GraduationCap size={23} aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-bold text-slate-950">Campus focused</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Listings stay relevant to student needs and local campus life.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={23} aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-bold text-slate-950">Verified access</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Built around college email verification and authenticated flows.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <PackageSearch size={23} aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-bold text-slate-950">Student essentials</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Books, notes, gadgets, cycles, furniture, and lab equipment.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              Fresh listings
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Shop what students are selling
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit rounded-full border border-emerald-600 px-5 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            View all products
          </Link>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categoryHighlights.map((category) => (
            <span
              key={category}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
            >
              {category}
            </span>
          ))}
        </div>

        {isLoadingProducts && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoadingProducts && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {!isLoadingProducts && !errorMessage && featuredProducts.length === 0 && (
          <EmptyProductsState />
        )}

        {!isLoadingProducts && !errorMessage && featuredProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}