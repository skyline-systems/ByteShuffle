import { Button } from "@heroui/button";

export const ShuffleButton = ({
  handleShuffle,
}: {
  handleShuffle: () => void;
}) => {
  return (
    <div className="flex justify-center items-center">
      <Button color="primary" radius="sm" onPress={handleShuffle}>
        Shuffle
      </Button>
    </div>
  );
};
