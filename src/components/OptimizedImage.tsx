import React, { useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Image, ImageProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface OptimizedImageProps extends Omit<ImageProps, "source"> {
  source: string | { uri: string };
  fallback?: string;
  showLoading?: boolean;
  containerStyle?: any;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  fallback,
  showLoading = true,
  containerStyle,
  onLoadStart,
  onLoadEnd,
  onError,
  style,
  ...props
}) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    onLoadEnd?.();
  }, [onLoadEnd]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Determine which image to show
  const getImageSource = () => {
    if (hasError && fallback) {
      return typeof fallback === 'string' ? { uri: fallback } : fallback;
    }

    if (typeof source === "string") {
      return { uri: source };
    }

    return source;
  };

  const styles = createStyles(isDark);

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={getImageSource()}
        style={[styles.image, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />

      {isLoading && showLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={isDark ? "#3B82F6" : "#083198"}
          />
        </View>
      )}

      {hasError && !fallback && (
        <View style={styles.errorContainer}>
          <Image
            source={require("@/assets/icon.png")} // Default app icon as fallback
            style={styles.errorImage}
          />
        </View>
      )}
    </View>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: "relative",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark
        ? "rgba(17, 24, 39, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
    },
    errorContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#374151" : "#F3F4F6",
    },
    errorImage: {
      width: 24,
      height: 24,
      opacity: 0.5,
    },
  });

export default OptimizedImage;
