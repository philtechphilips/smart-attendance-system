import React from "react";
import style from "../../forms/company-profile-form/styles.module.scss";

interface ProgressBarStepperProps {
  currentStep: number;
}

const ProgressBarStepper: React.FC<ProgressBarStepperProps> = ({
  currentStep,
}) => {
  const totalSteps = 4; // Total number of steps
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100; // Calculate progress percentage

  return (
    <div className={style.progressBar}>
      <div className={style.progress} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBarStepper;
