"use client"

import { useState, useRef, useEffect } from "react"

const OTPInput = ({ value, onChange, disabled = false, length = 6 }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""))
  const inputRefs = useRef([])

  useEffect(() => {
    // Update internal state when value prop changes
    if (value !== otp.join("")) {
      setOtp(value.split("").concat(new Array(length).fill("")).slice(0, length))
    }
  }, [value, length])

  const handleChange = (element, index) => {
    if (disabled) return

    const val = element.value
    if (isNaN(val)) return

    const newOtp = [...otp]
    newOtp[index] = val.substring(val.length - 1)
    setOtp(newOtp)

    const otpValue = newOtp.join("")
    onChange(otpValue)

    // Focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (disabled) return

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1].focus()
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
        onChange(newOtp.join(""))
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e) => {
    if (disabled) return

    e.preventDefault()
    const pasteData = e.clipboardData.getData("text")
    const pasteArray = pasteData
      .split("")
      .filter((char) => !isNaN(char))
      .slice(0, length)

    if (pasteArray.length > 0) {
      const newOtp = new Array(length).fill("")
      pasteArray.forEach((char, index) => {
        if (index < length) {
          newOtp[index] = char
        }
      })
      setOtp(newOtp)
      onChange(newOtp.join(""))

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((val) => val === "")
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1
      inputRefs.current[focusIndex].focus()
    }
  }

  const handleFocus = (index) => {
    // Select all text when focusing
    inputRefs.current[index].select()
  }

  return (
    <div className="otp-input-container">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="1"
          ref={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`otp-input ${disabled ? "disabled" : ""}`}
          autoComplete="off"
        />
      ))}
    </div>
  )
}

export default OTPInput
