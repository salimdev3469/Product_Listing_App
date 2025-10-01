import { useEffect, useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});
  const sliderRef = useRef(null);

  const CARD_WIDTH = 380;
  const CARD_GAP = 35;
  const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP;

  const MAX_CARDS_VISIBLE = 4;
  const SLIDER_MAX_WIDTH = (CARD_WIDTH * MAX_CARDS_VISIBLE) + (CARD_GAP * (MAX_CARDS_VISIBLE - 1));

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const defaultColors = {};
        data.forEach((_, i) => (defaultColors[i] = "yellow"));
        setSelectedColors(defaultColors);
      });
  }, []);

  const handleColorChange = (index, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [index]: color,
    }));
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const newScrollLeft =
        direction === "left"
          ? sliderRef.current.scrollLeft - SCROLL_AMOUNT
          : sliderRef.current.scrollLeft + SCROLL_AMOUNT;

      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <h1
        className="avenir-book"
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "black",
          fontSize: "45px",
          paddingTop: "40px",
        }}
      >
        Product List
      </h1>

      <div
        style={{
          position: "relative",
          maxWidth: `${SLIDER_MAX_WIDTH}px`,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: "-50px",
            top: "40%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            fontSize: "40px",
            color: "#333",
            padding: "10px",
          }}
        >
          <FaChevronLeft />
        </button>

        <div
          ref={sliderRef}
          style={{
            display: "flex",
            gap: `${CARD_GAP}px`,
            overflowX: "hidden",
            paddingBottom: "10px",
            scrollSnapType: "x mandatory",
            padding: "0",
          }}
        >
          {products.map((product, index) => {
            const selectedColor = selectedColors[index] || "yellow";
            return (
              <div
                key={index}
                style={{
                  flex: "0 0 auto",
                  width: `${CARD_WIDTH}px`,
                  borderRadius: "12px",
                  padding: "15px",
                  textAlign: "left",
                  background: "#fff",
                  scrollSnapAlign: "start",
                }}
              >
                <img
                  src={product.images[selectedColor]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
                <h3
                  className="medium-montserrat"
                  style={{ margin: "10px 0", color: "black", fontSize: "15px" }}
                >
                  {product.name}
                </h3>
                <p
                  className="regular-montserrat"
                  style={{ color: "#000", fontSize: "15px" }}
                >
                  ${product.price} USD
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    gap: "10px",
                    margin: "10px 0",
                  }}
                >
                  {["yellow", "white", "rose"].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(index, color)}
                      style={{
                        padding: "2px",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border:
                          selectedColor === color
                            ? "2px solid black"
                            : "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background:
                            color === "yellow"
                              ? "#E6CA97"
                              : color === "white"
                                ? "#D9D9D9"
                                : "#E1A4A9",
                        }}
                      />
                    </button>
                  ))}
                </div>

                <p
                  className="avenir-book"
                  style={{ color: "#777", fontSize: "12px" }}
                >
                  {selectedColor === "yellow"
                    ? "Yellow Gold"
                    : selectedColor === "white"
                      ? "White Gold"
                      : "Rose Gold"}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      color={
                        i < Math.round(product.popularityScore * 5)
                          ? "#f5a623"
                          : "#ddd"
                      }
                      size={14}
                    />
                  ))}
                  <span
                    className="avenir-book"
                    style={{
                      marginLeft: "5px",
                      color: "black",
                      fontSize: "14px",
                    }}
                  >
                    {(product.popularityScore * 5).toFixed(1)}/5
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: "-50px",
            top: "40%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            fontSize: "40px",
            color: "#333",
            padding: "10px",
          }}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default App;