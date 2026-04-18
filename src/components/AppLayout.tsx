"use client";
import { useState, useMemo, Fragment, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AppSidebar from "@/components/Sidebar";
import { SidebarInset, SidebarTrigger } from "@/context/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/context/components/ui/breadcrumb";
import { SemesterRoutes } from "@/utils/data/routes";

type BreadcrumbEntry = { label: string; href: string };

type TopicData = { $id: string; semester: string };

type AppLayoutProps = {
  title: string;
  breadcrumbs?: BreadcrumbEntry[]; // Opcional, si no se pasa se genera automáticamente
  activeTopicId?: string | null;
  children: React.ReactNode;
  customTopics?: TopicData[];
  isAdmin?: boolean;
  onLogout?: () => void;
  isLogoutPending?: boolean;
  onTopicSelectOverride?: (id: string) => void;
  onCreateTopic?: () => void;
  headerRightContent?: React.ReactNode;
};

const AppLayout = ({
 // title,
  breadcrumbs,
  activeTopicId: initialActiveId = null,
  children,
  customTopics,
  isAdmin = false,
  onLogout,
  isLogoutPending,
  onTopicSelectOverride,
  onCreateTopic,
  headerRightContent,
}: AppLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(
    initialActiveId,
  );

  useEffect(() => {
    if (initialActiveId !== undefined) {
      setActiveTopicId(initialActiveId);
    }
  }, [initialActiveId]);

  const staticTopics = SemesterRoutes.map((route) => ({
    $id: route.id.toString(),
    semester: route.name,
  }));

  const topicsToUse = customTopics || staticTopics;

  const handleTopicSelect = (id: string) => {
    if (onTopicSelectOverride) {
      onTopicSelectOverride(id);
      return;
    }
    setActiveTopicId(id);
    const topic = SemesterRoutes.find((r) => r.id.toString() === id);
    if (topic) router.push(topic.mainroute);
  };

  // Generar breadcrumbs automáticamente desde la ruta si no se proporcionan
  const autoBreadcrumbs = useMemo(() => {
    if (breadcrumbs) return breadcrumbs;

    const segments = pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbEntry[] = [{ label: "Inicio", href: "/" }];

    let currentPath = "";
    segments.forEach((segment) => {
      currentPath += `/${segment}`;

      // Buscar en SemesterRoutes
      const semester = SemesterRoutes.find((s) => s.mainroute === currentPath);
      if (semester) {
        crumbs.push({ label: semester.name, href: currentPath });
        return;
      }

      // Buscar en cursos de cada semestre
      for (const semester of SemesterRoutes) {
        const course = semester.routes.find((r) => r.href === currentPath);
        if (course) {
          crumbs.push({ label: course.name, href: currentPath });
          return;
        }

        // Buscar en subrutas de cada curso
        for (const course of semester.routes) {
          const subroute = course.subroutes?.find(
            (sr) => sr.href === currentPath,
          );
          if (subroute) {
            crumbs.push({ label: subroute.name, href: currentPath });
            return;
          }
        }
      }

      // Si no se encuentra, usar el segmento formateado
      const formatted = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      crumbs.push({ label: formatted, href: currentPath });
    });

    return crumbs;
  }, [pathname, breadcrumbs]);

  return (
    <>
      <AppSidebar
        topics={topicsToUse}
        activeTopicId={activeTopicId}
        onTopicSelect={handleTopicSelect}
        isAdmin={isAdmin}
        onCreateTopic={onCreateTopic}
        onLogout={onLogout}
        isLogoutPending={isLogoutPending}
      />
      <SidebarInset className="flex flex-col flex-1 w-full bg-background transition-all duration-200 ease-linear">
        <header className="sticky top-0 w-full z-30 bg-neutral-100 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-outline-variant/15">
          <div className="flex justify-between items-center px-4 md:px-4 h-16 w-full max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-2 md:gap-4 text-xl md:text-2xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 uppercase">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {autoBreadcrumbs.map((crumb, i) => {
                  const isLast = i === autoBreadcrumbs.length - 1;
                  return (
                    <Fragment key={i}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            </div>
            {headerRightContent && (
              <div className="hidden md:flex items-center space-x-8">
                {headerRightContent}
              </div>
            )}
          </div>
        </header>

        {children}
      </SidebarInset>
    </>
  );
};

export default AppLayout;
