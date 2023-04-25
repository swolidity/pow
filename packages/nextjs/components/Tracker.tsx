import { useState } from "react";
import { DeleteIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

export default function Home() {
  const [exercises, setExercises] = useState([{ name: "pushup", repetitions: ethers.BigNumber.from(1) }]);

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "ProofOfWorkout",
    functionName: "mintWorkout",
    args: [exercises],
    value: "0.01",
  });

  useScaffoldEventSubscriber({
    contractName: "ProofOfWorkout",
    eventName: "MintWorkout",
    //parameters that the event emits
    //event GreetingChange(address greetingSetter, string newGreeting, bool premium, uint256 value);
    listener: exerciseSets => {
      console.log({ exerciseSets });
    },
  });

  console.log({ exercises });

  return (
    <Container maxW={"100%"}>
      <Flex>
        <Box mr={6}>
          {exercises.map((exercise, i) => {
            return (
              <Flex key={i} mb={4}>
                <Select
                  value={exercises[i].name}
                  onChange={e => {
                    setExercises([
                      ...exercises.slice(0, i),
                      {
                        ...exercises[i],
                        name: e.target.value,
                      },
                      ...exercises.slice(i + 1),
                    ]);
                  }}
                >
                  <option value="pushup">Push Up</option>
                  <option value="air-squat">Air Squat</option>
                  <option value="lunge">Lunge</option>
                </Select>
                <Box mx={2} alignItems="center">
                  <SmallCloseIcon />
                </Box>
                <NumberInput
                  mx={2}
                  value={exercises[i].repetitions.toNumber()}
                  onChange={n => {
                    setExercises([
                      ...exercises.slice(0, i),
                      {
                        ...exercises[i],
                        repetitions: ethers.BigNumber.from(n),
                      },
                      ...exercises.slice(i + 1),
                    ]);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <IconButton
                  onClick={() => {
                    console.log({ i });
                    setExercises([...exercises.slice(0, i), ...exercises.slice(i + 1)]);
                  }}
                  aria-label="delete exercise"
                  icon={<DeleteIcon />}
                />
              </Flex>
            );
          })}
          <Button
            mb={6}
            onClick={() =>
              setExercises([
                ...exercises,
                {
                  name: "pushup",
                  repetitions: ethers.BigNumber.from(1),
                },
              ])
            }
          >
            Add Exercise
          </Button>
        </Box>

        <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
          <div className="flex rounded-full border-2 border-primary p-1">
            <button
              className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                isLoading ? "loading" : ""
              }`}
              onClick={writeAsync}
            >
              {!isLoading && <>Mint Workout</>}
            </button>
          </div>
        </div>
      </Flex>
    </Container>
  );
}
