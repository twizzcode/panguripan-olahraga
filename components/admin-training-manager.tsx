"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createTraining,
  deleteTraining,
  updateTraining,
  reorderTraining,
} from "@/app/(admin)/admin/klinik-pelatih/actions";
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
  description: string;
  videoSrc: string;
  thumbnailSrc: string;
  sortOrder: number;
};

type TrainingFormValues = {
  title: string;
  description: string;
  videoSrc: string;
  thumbnailSrc: string;
};

const initialValues: TrainingFormValues = {
  title: "",
  description: "",
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
    <Button type="submit" disabled={isPending} variant="brand">
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

  const handleMoveUp = (id: string, currentOrder: number) => {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("direction", "up");

    startTransition(async () => {
      await reorderTraining(formData);
      router.refresh();
    });
  };

  const handleMoveDown = (id: string, currentOrder: number) => {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("direction", "down");

    startTransition(async () => {
      await reorderTraining(formData);
      router.refresh();
    });
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Daftar Pelatihan</h2>
          <p className="text-sm text-muted-foreground">
            Kelola video pelatihan yang tampil di halaman publik.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="brand">
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
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {trainings.map((training, index) => (
              <TableRow key={training.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveUp(training.id, training.sortOrder)}
                      disabled={isPending || index === 0}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveDown(training.id, training.sortOrder)}
                      disabled={isPending || index === trainings.length - 1}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                  </div>
                </TableCell>
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
                <TableCell className="max-w-[24rem] whitespace-normal text-sm text-muted-foreground">
                  {training.description}
                </TableCell>
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
          <FieldLabel htmlFor={`${trainingId ?? "create"}-description`}>
            Deskripsi
          </FieldLabel>
          <Input
            id={`${trainingId ?? "create"}-description`}
            name="description"
            defaultValue={values.description}
            placeholder="Deskripsi singkat pelatihan"
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
