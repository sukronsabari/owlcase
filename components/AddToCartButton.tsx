"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, ShoppingCart } from "lucide-react";

export function AddToCartButton() {
  const [isClicked, setIsClicked] = useState(false);
  const [showFlyingIcon, setShowFlyingIcon] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setShowFlyingIcon(true);

    // Reset state after animation
    setTimeout(() => {
      setIsClicked(false);
    }, 300);

    setTimeout(() => {
      setShowFlyingIcon(false);
    }, 1000); // Hide flying icon after animation ends
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.button
        onClick={handleClick}
        initial={{ scale: 1 }}
        animate={{ scale: isClicked ? 1.2 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          border: "none",
          borderRadius: "5px",
          background: "blue",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box style={{ marginRight: "8px" }} /> Add to Cart
      </motion.button>
      {showFlyingIcon && (
        <motion.div
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, x: 50, y: -100 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "24px",
            height: "24px",
            color: "blue",
          }}
        >
          <Box />
        </motion.div>
      )}
      <motion.div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "24px",
          color: "blue",
        }}
      >
        <ShoppingCart />
      </motion.div>
    </div>
  );
}
