// import {
//   Button,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
// } from "@heroui/react";

// import { EllipsisVertical } from "lucide-react";

export const Header = ({ handleShuffle }: { handleShuffle: () => void }) => {
  return (
    <div className="my-4 p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        ByteShuffle
      </h1>

      {/* <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <EllipsisVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new">New file</DropdownItem>
          <DropdownItem key="copy">Copy link</DropdownItem>
          <DropdownItem key="edit">Edit file</DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            Delete file
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
    </div>
  );
};
