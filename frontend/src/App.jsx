import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

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

  return (
    <div style={{ padding: "40px", background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "black" }}>
        Product List
      </h1>


      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          paddingBottom: "10px",
          scrollSnapType: "x mandatory",
        }}
      >
        {products.map((product, index) => {
          const selectedColor = selectedColors[index] || "yellow";
          return (
            <div
              key={index}
              style={{
                flex: "0 0 auto",
                width: "250px",
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
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <h3 style={{ margin: "10px 0", color: "black" }}>{product.name}</h3>
              <p style={{ fontWeight: "bold", color: "#000" }}>${product.price} USD</p>

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
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border:
                        selectedColor === color
                          ? "2px solid black"
                          : "1px solid #ccc",
                      background:
                        color === "yellow"
                          ? "#E6CA97"
                          : color === "white"
                            ? "#D9D9D9"
                            : "#E1A4A9",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>

              {/* Seçili rengi yaz */}
              <p style={{ color: "#777" }}>
                {selectedColor === "yellow"
                  ? "Yellow Gold"
                  : selectedColor === "white"
                    ? "White Gold"
                    : "Rose Gold"}
              </p>



              {/* Rating */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
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
                  />
                ))}
                <span style={{ marginLeft: "5px", color: "black" }}>
                  {(product.popularityScore * 5).toFixed(1)}/5
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
