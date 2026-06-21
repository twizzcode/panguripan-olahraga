"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createTraining,
  deleteTraining,
  updateTraining,
} from "@/app/(admin)/admin/pelatihan/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Training = {
  id: string;
  title: string;
  duration: string;
  videoSrc: string;
  thumbnailSrc: string;
};

type TrainingFormValues = {
  title: string;
  duration: string;
  videoSrc: string;
  thumbnailSrc: string;
};

const initialValues: TrainingFormValues = {
  title: "",
  duration: "",
  videoSrc: "",
  thumbnailSrc: "",
};

function SubmitButton({
  label,
  pendingLabel,
  isPending,
}: {
  label: string;
  pendingLabel: string;
  isPending: boolean;
}) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? pendingLabel : label}
    </Button>
  );
}

export function AdminTrainingManager({
  trainings,
}: {
  trainings: Training[];
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreate = (formData: FormData) => {
    startTransition(async () => {
      await createTraining(formData);
      setIsCreateOpen(false);
      router.refresh();
    });
  };

  const handleUpdate = (formData: FormData) => {
    startTransition(async () => {
      await updateTraining(formData);
      setEditingTraining(null);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    const formData = new FormData();
    formData.set("id", id);

    startTransition(async () => {
      await deleteTraining(formData);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Daftar Pelatihan</h2>
          <p className="text-sm text-muted-foreground">
            Kelola video pelatihan yang tampil di halaman publik.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Tambah Pelatihan
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[min(92vw,56rem)] max-w-none sm:max-w-none">
            <DialogHeader>
              <DialogTitle>Tambah Pelatihan</DialogTitle>
              <DialogDescription>
                Isi data pelatihan baru yang akan tampil di halaman publik.
              </DialogDescription>
            </DialogHeader>
            <TrainingForm
              values={initialValues}
              onSubmit={handleCreate}
              submitLabel="Simpan Pelatihan"
              pendingLabel="Menyimpan..."
              isPending={isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Total pelatihan: {trainings.length}
        </p>
      </div>

        {trainings.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {trainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>
                  <img
                    src={training.thumbnailSrc}
                    alt={training.title}
                    className="h-16 w-28 rounded-lg border border-border object-cover"
                  />
                </TableCell>
                <TableCell className="max-w-[20rem] font-medium whitespace-normal">
                  {training.title}
                </TableCell>
                <TableCell>{training.duration}</TableCell>
                <TableCell className="max-w-[18rem] whitespace-normal text-xs text-muted-foreground">
                  {training.videoSrc}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog
                      open={editingTraining?.id === training.id}
                      onOpenChange={(open) =>
                        setEditingTraining(open ? training : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[min(92vw,56rem)] max-w-none sm:max-w-none">
                        <DialogHeader>
                          <DialogTitle>Edit Pelatihan</DialogTitle>
                          <DialogDescription>
                            Ubah data pelatihan ini lalu simpan perubahan.
                          </DialogDescription>
                        </DialogHeader>
                        <TrainingForm
                          values={training}
                          trainingId={training.id}
                          onSubmit={handleUpdate}
                          submitLabel="Update Pelatihan"
                          pendingLabel="Menyimpan..."
                          isPending={isPending}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isPending}
                        >
                          <Trash2 className="size-4" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Hapus pelatihan ini?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Data pelatihan{" "}
                            <span className="font-medium text-foreground">
                              {training.title}
                            </span>{" "}
                            akan dihapus dari admin dan halaman publik.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDelete(training.id)}
                          >
                            Ya, hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          Belum ada data pelatihan. Tambahkan pelatihan pertama lewat tombol di
          atas.
        </p>
      )}
    </div>
  );
}

function TrainingForm({
  values,
  trainingId,
  onSubmit,
  submitLabel,
  pendingLabel,
  isPending,
}: {
  values: TrainingFormValues;
  trainingId?: string;
  onSubmit: (formData: FormData) => void;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
}) {
  return (
    <form
      action={(formData) => onSubmit(formData)}
      className="space-y-4"
    >
      {trainingId ? <input type="hidden" name="id" value={trainingId} /> : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${trainingId ?? "create"}-title`}>Title</FieldLabel>
          <Input
            id={`${trainingId ?? "create"}-title`}
            name="title"
            defaultValue={values.title}
            placeholder="Judul pelatihan"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${trainingId ?? "create"}-duration`}>
            Durasi
          </FieldLabel>
          <Input
            id={`${trainingId ?? "create"}-duration`}
            name="duration"
            defaultValue={values.duration}
            placeholder="Contoh: 12 menit"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${trainingId ?? "create"}-video`}>
            Video URL
          </FieldLabel>
          <Input
            id={`${trainingId ?? "create"}-video`}
            name="videoSrc"
            defaultValue={values.videoSrc}
            placeholder="https://www.youtube.com/embed/..."
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${trainingId ?? "create"}-thumbnail`}>
            Thumbnail URL
          </FieldLabel>
          <Input
            id={`${trainingId ?? "create"}-thumbnail`}
            name="thumbnailSrc"
            defaultValue={values.thumbnailSrc}
            placeholder="https://...thumbnail.jpg"
            required
          />
        </Field>
      </FieldGroup>

      <DialogFooter>
        <SubmitButton
          label={submitLabel}
          pendingLabel={pendingLabel}
          isPending={isPending}
        />
      </DialogFooter>
    </form>
  );
}
