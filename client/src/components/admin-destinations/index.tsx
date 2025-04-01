import { ScrollArea } from "@radix-ui/react-scroll-area";
import AdminCard from "../admin-card";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function AdminDestination() {
  return (
    <div>
      <Card className="px-0">
        <CardHeader className="flex flex-row justify-between items-center ">
          <CardTitle className="text-3xl font-extrabold">
            Top Destinations
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">Add New Destination</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Destination</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value="" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    value=""
                    className="col-span-3"
                    type="number"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-4">
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
          <AdminCard
            image="/image3.jpg"
            name="name"
            description="Description"
            rating={5}
            onEditNavigate="/admin/destination/edit/1"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDestination;
