import { useState } from "react";
import { toast } from "sonner";
import { checkServiceAvailability } from "@/features/home/api/homeApi";

export const usePincodeValidation = () => {
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const validatePincode = async (pincode) => {
    if (!pincode) {
      setPincodeError("");
      return false;
    }

    setIsCheckingPincode(true);
    setPincodeError("");

    try {
      const response = await checkServiceAvailability(pincode);

      if (
        response?.data?.success === true ||
        response?.data?.success === "true"
      ) {
        setPincodeError("");
        toast.success(response?.data?.message || "Pincode is serviceable");
        return true;
      } else {
        const errorMsg =
          response.message || "Sorry, we don't deliver to this pincode area";
        setPincodeError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = "Failed to verify pincode. Please try again.";
      setPincodeError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const handlePostalCodeChange = async (value, setFormData) => {
    setFormData((prev) => ({
      ...prev,
      postalCode: value,
    }));

    if (value.length === 6) {
      await validatePincode(value);
    } else {
      setPincodeError("");
    }
  };

  // const validatePincodeBeforeSubmit = async (postalCode) => {
  //   if (postalCode) {
  //     const isServiceable = await validatePincode(postalCode);

  //     console.log("isServiceable",isServiceable);

  //     if (!isServiceable || pincodeError) {
  //       toast.error(pincodeError);
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const validatePincodeBeforeSubmit = async (postalCode) => {
    if (!postalCode) {
      toast.error("Please enter a pincode");
      return false;
    }

    if (postalCode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    // Directly use the return value without checking pincodeError state
    const isServiceable = await validatePincode(postalCode);
    return isServiceable;
  };

  return {
    isCheckingPincode,
    pincodeError,
    setPincodeError,
    validatePincode,
    handlePostalCodeChange,
    validatePincodeBeforeSubmit,
  };
};
