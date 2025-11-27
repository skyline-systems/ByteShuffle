import { Button } from "@heroui/button";

export const ShuffleButton = ({
  handleShuffle,
}: {
  handleShuffle: () => void;
}) => {
  return (
    <div className="flex justify-center items-center">
      <Button
        size="lg"
        color="primary"
        variant="shadow"
        radius="sm"
        onPress={handleShuffle}
        className="w-[150px]"
      >
        Shuffle
      </Button>
    </div>
  );
};
