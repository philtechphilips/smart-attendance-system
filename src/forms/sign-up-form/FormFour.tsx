import SelectInput from "@/components/inputs/select-input/SelectInput";
import TextInput from "@/components/inputs/text-input/TextInput";
import { getAllDepartments } from "@/reducer/actions/department.dispatcher";
import { getAllLevels } from "@/reducer/actions/level.dispatcher";
import { getAllPrograms } from "@/reducer/actions/program.dispatcher";
import { getAllSchools } from "@/reducer/actions/school.dispatcher";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import React, { useEffect } from "react";
interface FormOneProps {
  user: any;
  handleChange: (event: any) => void;
  errors: any;
  touched: any;
}
const FormFour: React.FC<FormOneProps> = ({
  user,
  handleChange,
  errors,
  touched,
}) => {
  const dispatch = useAppDispatch();

  const { allSchools } = useAppSelector((state: RootState) => state.schools);
  const { allLevels } = useAppSelector((state: RootState) => state.levels);
  const { allPrograms } = useAppSelector((state: RootState) => state.programs);
  const { allDepartments } = useAppSelector(
    (state: RootState) => state.departments,
  );

  useEffect(() => {
    dispatch(getAllSchools());
    dispatch(getAllLevels());
    dispatch(getAllPrograms());
    dispatch(getAllDepartments());
  }, [dispatch]);
  return (
    <>
      <SelectInput
        label="Level"
        name="levelId"
        value={user.levelId}
        options={allLevels ? allLevels : []}
        errorMessage={touched.levelId && errors.levelId}
        handleChange={handleChange}
      />

      <SelectInput
        label="School"
        name="schoolId"
        value={user.schoolId}
        options={allSchools ? allSchools : []}
        errorMessage={touched.schoolId && errors.schoolId}
        handleChange={handleChange}
      />

      <SelectInput
        label="Department"
        name="departmentId"
        value={user.departmentId}
        options={allDepartments ? allDepartments : []}
        errorMessage={touched.departmentId && errors.departmentId}
        handleChange={handleChange}
      />

      <SelectInput
        label="Program"
        name="programId"
        value={user.programId}
        options={allPrograms ? allPrograms : []}
        errorMessage={touched.programId && errors.programId}
        handleChange={handleChange}
      />
    </>
  );
};

export default FormFour;
