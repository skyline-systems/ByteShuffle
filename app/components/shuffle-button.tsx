export const ShuffleButton = ({
  handleShuffle,
}: {
  handleShuffle: () => void;
}) => {
  return (
    <div className="flex justify-center items-center p-4">
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={handleShuffle}
      >
        Shuffle
      </button>
    </div>
  );
};
