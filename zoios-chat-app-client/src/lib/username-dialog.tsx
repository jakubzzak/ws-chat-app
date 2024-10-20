import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebsocketContext } from "@/utils/ws-context";
import { useContext, useState } from "react";

export const UsernameDialog = () => {
  const [username, setUsername] = useState<string | null>(null);
  const { isConnected, connect } = useContext(WebsocketContext);

  const onButtonClick = () => {
    if (username) {
      localStorage.setItem("username", username);
      connect(username);
    }
    // TODO handle error
  };

  return (
    <Dialog open={!isConnected}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose your username</DialogTitle>
          <DialogDescription>
            We recommend using a nickname that your friends can identify you
            with.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onButtonClick}>
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
