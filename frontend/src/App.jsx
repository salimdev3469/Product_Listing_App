import { useEffect, useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./App.css";

// Yükleme animasyonu için basit bir bileşen (CSS ile düzenlenebilir)
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px", // Yükleme alanını belirler
      fontSize: "20px",
      color: "#333",
    }}
  >
    <div className="spinner"></div> {/* Bu sınıfı CSS'e ekleyeceğiz */}
    Yükleniyor...
  </div>
);

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});
  // Yüklenme durumunu tutacak yeni state
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);
  const windowWidth = useWindowWidth();

  let currentCardWidth;
  let currentCardGap;
  let currentScrollAmount;
  let sliderContainerMaxWidth;
  let cardsVisible;

  if (windowWidth > 1550) {
    currentCardWidth = 380;
    currentCardGap = 35;
    cardsVisible = 4;
  } else if (windowWidth > 1200) {
    currentCardWidth = 350;
    currentCardGap = 30;
    cardsVisible = 3;
  } else if (windowWidth > 600) {
    currentCardWidth = 300;
    currentCardGap = 20;
    cardsVisible = 2;
  } else {
    currentCardWidth = windowWidth * 0.85;
    currentCardGap = windowWidth * 0.05;
    cardsVisible = 1;
  }

  currentScrollAmount = currentCardWidth + currentCardGap;
  sliderContainerMaxWidth = (currentCardWidth * cardsVisible) + (currentCardGap * (cardsVisible - 1));

  const isMobile = windowWidth <= 600;

  useEffect(() => {
    // Veri çekme başladığında isLoading zaten true
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const defaultColors = {};
        data.forEach((_, i) => (defaultColors[i] = "yellow"));
        setSelectedColors(defaultColors);
      })
      .catch((error) => {
        console.error("Ürünler yüklenirken hata oluştu:", error);
      })
      .finally(() => {
        // Veri çekme tamamlandığında (başarılı veya başarısız) loading'i false yap
        setIsLoading(false);
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
          ? sliderRef.current.scrollLeft - currentScrollAmount
          : sliderRef.current.scrollLeft + currentScrollAmount;

      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // ------------------------------------------------------------------

  // isLoading true iken yükleme animasyonunu göster
  if (isLoading) {
    return (
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        <h1
          className="avenir-book"
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "black",
            fontSize: isMobile ? "32px" : "45px",
            paddingTop: "40px",
          }}
        >
          Product List
        </h1>
        {/* Yükleniyor... */}
        <LoadingSpinner />
      </div>
    );
  }

  // Veriler yüklendikten sonra normal içeriği göster
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <h1
        className="avenir-book"
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "black",
          fontSize: isMobile ? "32px" : "45px",
          paddingTop: "40px",
        }}
      >
        Product List
      </h1>

      <div
        style={{
          position: "relative",
          maxWidth: isMobile ? '100%' : `${sliderContainerMaxWidth}px`,
          margin: "0 auto",
        }}
      >
        {/* Sol ok butonu */}
        <button
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: isMobile ? "5px" : "-50px",
            top: "40%",
            transform: "translateY(-50%)",
            background: isMobile ? "rgba(255, 255, 255, 0.7)" : "transparent",
            borderRadius: isMobile ? "50%" : "0",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            fontSize: isMobile ? "24px" : "40px",
            color: "#333",
            padding: "10px",
          }}
        >
          <FaChevronLeft />
        </button>

        {/* Ürün Kaydırıcısı */}
        <div
          ref={sliderRef}
          style={{
            display: "flex",
            gap: `${currentCardGap}px`,
            overflowX: "hidden",
            paddingBottom: "10px",
            scrollSnapType: "x mandatory",
            padding: isMobile ? `0 ${currentCardGap}px` : "0",
          }}
        >
          {products.map((product, index) => {
            const selectedColor = selectedColors[index] || "yellow";
            return (
              <div
                key={index}
                style={{
                  flex: "0 0 auto",
                  width: `${currentCardWidth}px`,
                  borderRadius: "12px",
                  padding: "15px",
                  textAlign: "left",
                  background: "#fff",
                  scrollSnapAlign: isMobile ? "center" : "start",
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
                  style={{ margin: "10px 0", color: "black", fontSize: isMobile ? "14px" : "15px" }}
                >
                  {product.name}
                </h3>
                <p
                  className="regular-montserrat"
                  style={{ color: "#000", fontSize: isMobile ? "14px" : "15px" }}
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

        {/* Sağ ok butonu */}
        <button
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: isMobile ? "5px" : "-50px",
            top: "40%",
            transform: "translateY(-50%)",
            background: isMobile ? "rgba(255, 255, 255, 0.7)" : "transparent",
            borderRadius: isMobile ? "50%" : "0",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            fontSize: isMobile ? "24px" : "40px",
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